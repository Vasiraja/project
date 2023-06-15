
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyService } from 'src/app/new.service';
import { interval, Subscription } from 'rxjs';

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
  total: string = '';
  timer: number = 0;
  timerSubscription: Subscription | undefined;
  countdownTimer: number = 0;

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
      this.total = params['total'];
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

  selectAnswer(question: Question, selectedOption: string): void {
    question.selectedOption = selectedOption;
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
    let score = 0;

    this.reasoningQuestions.forEach((question) => {
      if (question.selectedOption === question.correctAnswer) {
        // Use strict equality comparison for correctness check
        score += parseInt(this.reasoningmark, 10);
      }
    });

    this.englishQuestions.forEach((question) => {
      if (question.selectedOption === question.correctAnswer) {
        // Use strict equality comparison for correctness check
        score += parseInt(this.englishmark, 10);
      }
    });

    this.majorQuestions.forEach((question) => {
      if (question.selectedOption === question.correctAnswer) {
        // Use strict equality comparison for correctness check
        score += parseInt(this.majormark, 10);
      }
    });

    this.quizScore = (score / parseInt(this.total, 10)) * 100;
    this.quizScore = Math.floor(this.quizScore);

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
  
  






  formatTime(time: number): string {
    const min = (parseInt(Math.floor(time / 60).toString().padStart(2, '0')))/1000;
    const seconds = (time % 60).toString().padStart(2, '0');
     const minutes=Math.floor(min)
   
    return `${minutes}:${seconds}`;
  }
  
  

}
