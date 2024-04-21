import { LitElement, html, css } from 'lit';

export class TaggingQuestion extends LitElement {
  static styles = css`
    .tagging-question-container {
      background-color: #f3e9e0; 
      padding: 20px;
      border-radius: 15px;
      width: 80%;
      margin: 0 auto;
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
    }

    .tag {
      background-color: #d4d4d4; 
      padding: 8px 12px;
      border-radius: 20px;
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: pointer;
    }

    .tag.correct {
      background-color: #6bd425; 
    }

    .tag.incorrect {
      background-color: #ff6961; 
    }

    .answer-area {
      min-height: 100px;
      border: 2px dashed #ccc;
      margin-top: 20px;
    }

    .check-answer-btn,
    .reset-btn {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #007bff; 
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .check-answer-btn:disabled {
      background-color: #ccc; 
      cursor: not-allowed;
    }
  `;

  static properties = {
    tagData: { type: Array }, 
    droppedTag: { type: String }, // Currently dropped tag value
    isAnswered: { type: Boolean }, // Flag to indicate if answer has been dropped
    imageData: { type: String }, // URL of the image
    question: { type: String },
    feedbackMessage: { type: String }
  };

  constructor() {
    super();
    this.imageData = ''; // Initialize to empty string
    this.question = ''; // Initialize to empty string
    this.tagData = [
      { value: 'Relaxed', correct: true, feedback: 'Feeling relaxed while enjoying the calm atmosphere of the beach.' },
      { value: 'Excited', correct: true, feedback: 'Feeling excited about the fun activities and adventures at the beach.' },
      { value: 'Sunny', correct: true, feedback: 'Enjoying the warmth and brightness of the sun at the beach.' },
      { value: 'Refreshing', correct: true, feedback: 'Feeling refreshed by the cool breeze and ocean waves.' },
      { value: 'Crowded', correct: false, feedback: 'Feeling overwhelmed by the large number of people at the beach.' },
      { value: 'Boring', correct: false, feedback: 'Feeling unenthusiastic due to the lack of activities and excitement at the beach.' },
      { value: 'Cloudy', correct: false, feedback: 'Being frustrated by the overcast weather and lack of sunshine at the beach.' }
    ];
    this.droppedTag = [];
    this.isAnswered = false;
    this.feedbackMessage = '';
  }

  // Modify the render function to display multiple dropped tags
  render() {
    return html`
      <div class="tagging-question-container">
        <!-- Image -->
        ${this.imageData ? html`<img src="${this.imageData}" alt="Question Image" class="question-image">` : ''}
        <!-- Question -->
        ${this.question ? html`<div class="question">${this.question}</div>` : ''}
        <div class="tags-container">
          <!-- Draggable tags -->
          ${this.tagData.map(
            (tag) => html`
              <div 
                class="tag" 
                draggable="true" 
                @dragstart="${(e) => this.dragStart(e, tag)}"
              >
                ${tag.value}
              </div>
            `
          )}
        </div>
        <!-- Answer area -->
        <div 
          class="answer-area" 
          @dragover="${this.allowDrop}" 
          @drop="${this.drop}"
        >
          <!-- Display dropped tags -->
          ${this.droppedTags ? this.droppedTags.map(tag => html`<div class="dropped-tag">${tag}</div>`) : ''}
        </div>
        <!-- Feedback area -->
        <div class="feedback">${this.feedbackMessage}</div>
        <button class="check-answer-btn" ?disabled="${!this.isAnswered}" @click="${this.checkAnswer}">Check Answer</button>
        <button class="reset-btn" @click="${this.reset}">Reset</button>
      </div>
    `;
  }

  

  dragStart(e, tag) {
    e.dataTransfer.setData('text/plain', tag.value);
  }

  allowDrop(e) {
    e.preventDefault();
  }

  drop(e) {
    e.preventDefault();
    const draggedTag = e.dataTransfer.getData('text/plain');
    // Push the dragged tag to the droppedTags array
    this.droppedTags = [...this.droppedTags, draggedTag];
    this.isAnswered = true;
  }

  checkAnswer() {
    const incorrectTags = this.droppedTags.filter(tag => !this.tagData.find(item => item.value === tag)?.correct);
    if (incorrectTags.length > 0) {
      this.feedbackMessage = 'Incorrect!';
    } else {
      this.feedbackMessage = 'Correct!';
    }
  }

  reset() {
    this.droppedTags = []; // Reset droppedTags array
    this.isAnswered = false;
    this.feedbackMessage = ''; // Reset feedback message
  }
}

customElements.define('tagging-question', TaggingQuestion);