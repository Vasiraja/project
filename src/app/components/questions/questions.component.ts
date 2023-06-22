import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyService } from 'src/app/new.service';
import { interval, Subscription } from 'rxjs';
import { MatTabGroup } from '@angular/material/tabs';

interface Question {
  serialNumber: number;
  description: string;
  options: string[];
  selectedOption: string | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  correctAnswer: string; // Add this property
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  stuid: string = '';
  challenge_id: string = '';
  reasoningQuestions: Question[] = [];
  englishQuestions: Question[] = [];
  majorQuestions: Question[] = [];
  currentQuestionIndex: number = 0;
  selectedTab: string = '';
  isQuizFinished: boolean = false;
  quizScore: number = 0;
  comp_id: string = '';
  reasoningmark: string = '';
  englishmark: string = '';
  majormark: string = '';
  total: number = 0;
  timer: number = 0;
  timerSubscription: Subscription | undefined;
  countdownTimer: number = 0;
  selectedOptions: string[] = []; // Array to store selected options

  duration: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MyService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.stuid = params['stuid'];
      this.challenge_id = params['challenge_id'];

      const reasoningCount = params['no_ofReasoning'] ? +params['no_ofReasoning'] : 0;
      const englishCount = params['no_ofEnglish'] ? +params['no_ofEnglish'] : 0;
      const majorCount = params['no_ofmajor'] ? +params['no_ofmajor'] : 0;
      this.comp_id = params['comp_id'];
      this.reasoningmark = params['reasoningmark'];
      this.englishmark = params['englishmark'];
      this.majormark = params['majormark'];
      this.total = params['totalmarks'];
      this.duration = params['duration'];
      this.timer = this.duration || 0;

      if (reasoningCount > 0) {
        this.service.getReasoningQuestions(reasoningCount, 'medium').subscribe((data: any) => {
          this.reasoningQuestions = this.processQuestionsData(data.results);
        });
      }

      if (englishCount > 0) {
        this.service.getEnglishQuestions(englishCount, 'medium').subscribe((data: any) => {
          this.englishQuestions = this.processQuestionsData(data.results);
        });
      }

      if (majorCount > 0) {
        this.service.getComputerQuestions(majorCount, 'medium').subscribe((data: any) => {
          this.majorQuestions = this.processQuestionsData(data.results);
        });
      }
    });

    this.countdownTimer = (this.duration || 0) - 1;

    // Start the countdown timer
    interval(1000).subscribe(() => {
      if (this.countdownTimer > 0) {
        this.countdownTimer--;
      }
    });

    if (this.timer > 0) {
      this.timerSubscription = interval(1000).subscribe(() => {
        this.timer--;
      });
    }

    setTimeout(() => {
      this.jump();
    }, this.duration);
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  processQuestionsData(results: any[]): Question[] {
    return results.map((question: any, index: number) => {
      const options = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);
      return {
        serialNumber: index + 1,
        description: question.question,
        options: options,
        selectedOption: null,
        isAnswered: false,
        isCorrect: null,
        correctAnswer: question.correct_answer // Set the correct answer
      };
    });
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  nextQuestion(): void {
    if (this.isQuizFinished) {
      return;
    }

    const currentQuestion = this.getCurrentQuestion();

    if (currentQuestion.selectedOption === null) {
      // No option selected, show an error or prompt the user to select an option.
      return;
    }

    currentQuestion.isAnswered = true;

    if (this.currentQuestionIndex < this.getQuestionsLength() - 1) {
      this.currentQuestionIndex++;
    } else {
      this.isQuizFinished = true;
      this.calculateQuizScore();
    }
  }

  selectTab(tabName: string): void {
    this.selectedTab = tabName;
  }

  selectAnswer(question: any, selectedOption: any): void {
    question.selectedOption = selectedOption;
    this.selectedOptions[question.serialNumber] = selectedOption; 
    
    this.isQuizFinished = this.reasoningQuestions.every(question => question.selectedOption !== null) &&
                        this.englishQuestions.every(question => question.selectedOption !== null) &&
                        this.majorQuestions.every(question => question.selectedOption !== null);
  }

  getCurrentQuestion(): Question {
    if (this.selectedTab === 'reasoning') {
      return this.reasoningQuestions[this.currentQuestionIndex];
    } else if (this.selectedTab === 'english') {
      return this.englishQuestions[this.currentQuestionIndex];
    } else if (this.selectedTab === 'major') {
      return this.majorQuestions[this.currentQuestionIndex];
    }
    return {} as Question;
  }

  calculateQuizScore(): void {
    let resscore = 0;
    let engscore=0;
    let majscore=0;

    this.reasoningQuestions.forEach((question) => {
      if (question.selectedOption === question.correctAnswer) {
        // Use strict equality comparison for correctness check
        resscore += parseInt(this.reasoningmark);
      }
    });

    this.englishQuestions.forEach((question) => {
      if (question.selectedOption === question.correctAnswer) {
        // Use strict equality comparison for correctness check
        engscore += parseInt(this.englishmark);
      }
    });

    this.majorQuestions.forEach((question) => {
      if (question.selectedOption === question.correctAnswer) {
        // Use strict equality comparison for correctness check
        majscore += parseInt(this.majormark);
      }
    });
    let score=resscore+engscore+majscore;
  alert("score:"+score)
  alert("total:"+this.total)
    this.quizScore = (score / this.total) * 100;
   
    alert("Total Score in percent: " + this.quizScore);
    this.service.setQuizScore(this.quizScore);
  }

  isCurrentQuestionAnswered(): boolean {
    const currentQuestion = this.getCurrentQuestion();
    return currentQuestion.isAnswered || !this.hasNextQuestion();
  }

  hasNextQuestion(): boolean {
    return this.currentQuestionIndex < this.getQuestionsLength() - 1;
  }

  getQuestionsLength(): number {
    if (this.selectedTab === 'reasoning') {
      return this.reasoningQuestions.length;
    } else if (this.selectedTab === 'english') {
      return this.englishQuestions.length;
    } else if (this.selectedTab === 'major') {
      return this.majorQuestions.length;
    }
    return 0;
  }

  finishQuiz(): void {
    this.calculateQuizScore();
    console.log('Quiz Score:', this.quizScore);
  }

  jump(): void {
    this.calculateQuizScore();
      this.router.navigate(['/videoupload'], { queryParams: { stuid: this.stuid, id: this.comp_id } });
  }

  // Go to the next tab
  nextTab() {
    const selectedIndex = this.tabGroup.selectedIndex;
    const tabCount = this.tabGroup._tabs.length;

    if (selectedIndex !== null && selectedIndex < tabCount - 1) {
      this.tabGroup.selectedIndex = selectedIndex + 1;
    }
  }

  // Go to the previous tab
  previousTab() {
    const selectedIndex = this.tabGroup.selectedIndex;

    if (selectedIndex !== null && selectedIndex > 0) {
      this.tabGroup.selectedIndex = selectedIndex - 1;
    }
  }

  formatTime(time: number): string {
    const min = (parseInt(Math.floor(time / 60).toString().padStart(2, '0')))/1000;
    const seconds = (time % 60).toString().padStart(2, '0');
    const minutes = Math.floor(min);

    return `${minutes}:${seconds}`;
  }
}
