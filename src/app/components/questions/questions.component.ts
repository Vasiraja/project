import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { MyService } from 'src/app/new.service';

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
  selectedTab: any;
  isQuizFinished: boolean = false;
  quizScore: number = 0;
  comp_id:string='';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MyService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.stuid = params['stuid'];
      this.challenge_id = params['challenge_id'];

      const reasoningCount = params['no_ofReasoning'] ? +params['no_ofReasoning'] : 0;
      const englishCount = params['no_ofEnglish'] ? +params['no_ofEnglish'] : 0;
      const majorCount = params['no_ofmajor'] ? +params['no_ofmajor'] : 0;
      this.comp_id=params['comp_id'];

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

  nextQuestion(selectedTab: string): void {
    if (this.isQuizFinished) {
      return;
    }
  
    const currentQuestion = this.getCurrentQuestion(selectedTab);
  
    if (currentQuestion.selectedOption === null) {
      // No option selected, show an error or prompt the user to select an option.
      return;
    }
  
    currentQuestion.isAnswered = true;
  
    if (selectedTab === 'reasoning') {
      if (this.currentQuestionIndex < this.reasoningQuestions.length - 1) {
        this.currentQuestionIndex++;
      } else if (this.englishQuestions.length > 0) {
        this.selectedTab = 'english';
        this.currentQuestionIndex = 0;
      }
    } else if (selectedTab === 'english') {
      if (this.currentQuestionIndex < this.englishQuestions.length - 1) {
        this.currentQuestionIndex++;
      } else if (this.majorQuestions.length > 0) {
        this.selectedTab = 'major';
        this.currentQuestionIndex = 0;
      }
    } else if (selectedTab === 'major') {
      if (this.currentQuestionIndex < this.majorQuestions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.isQuizFinished = true;
        this.calculateQuizScore();
      }
    }
  }
  
        
  selectTab(tabName: any): void {
    this.selectedTab = tabName;
  }
        
  selectAnswer(question: Question, selectedOption: string): void {
    question.selectedOption = selectedOption;
  }
        
  getCurrentQuestion(selectedTab: string): Question {
    if (selectedTab === 'reasoning') {
      return this.reasoningQuestions[this.currentQuestionIndex];
    } else if (selectedTab === 'english') {
      return this.englishQuestions[this.currentQuestionIndex];
    } else if (selectedTab === 'major') {
      return this.majorQuestions[this.currentQuestionIndex];
    }
    return {} as Question;
  }
        
  calculateQuizScore(): void {
    let score = 0;
  
    this.reasoningQuestions.forEach(question => {
      if (question.selectedOption === question.options[question.options.indexOf(question.correctAnswer)]) {
        score++;
      }
    });
  
    this.englishQuestions.forEach(question => {
      if (question.selectedOption === question.options[question.options.indexOf(question.correctAnswer)]) {
        score++;
      }
    });
  
    this.majorQuestions.forEach(question => {
      if (question.selectedOption === question.options[question.options.indexOf(question.correctAnswer)]) {
        score++;
      }
    });
  
    this.quizScore = score;
    if(this.quizScore<4){
      this.router.navigate(['/not-eligible'],{ queryParams:{stuid:this.stuid}});
    }
    else{
      this.router.navigate(['/photo-input'])
    }
  }
  
  
        
  finishQuiz(): void {
    this.calculateQuizScore();
    
    console.log('Quiz Score:', this.quizScore);
     
  }
 

  isCurrentQuestionAnswered(): boolean {
    const currentQuestion = this.getCurrentQuestion(this.selectedTab);
    return currentQuestion.isAnswered || !this.hasNextQuestion();
  }

  hasNextQuestion(): boolean {
  if (this.selectedTab === 'reasoning') {
    return this.currentQuestionIndex < this.reasoningQuestions.length - 1;
  } else if (this.selectedTab === 'english') {
    return this.currentQuestionIndex < this.englishQuestions.length - 1;
  } else if (this.selectedTab === 'major') {
    return this.currentQuestionIndex < this.majorQuestions.length - 1;
  }
  return false;
}
 
jump(){
  this.router.navigate(['/videoupload'],{queryParams:{stuid:this.stuid,id:this.comp_id}});

}

  }
  
