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
    .tag.disabled {
      opacity: 0.5; 
      pointer-events: none; 
    }

    .answer-area {
      min-height: 100px;
      border: 2px dashed #ccc;
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    .dropped-tag {
      background-color: #007bff;
      color: #fff;
      padding: 8px 12px;
      border-radius: 20px;
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: default;
    }

    .feedback {
      margin-top: 10px;
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
    droppedTags: { type: Array },
    isAnswered: { type: Boolean },
    imageData: { type: String },
    question: { type: String },
    feedbackMessage: { type: String }
  };

  constructor() {
    super();
    this.imageData = '';
    this.question = '';
    this.tagData = [
      { value: 'Relaxed', correct: true, feedback: 'Feeling relaxed while enjoying the calm atmosphere of the beach.', draggable: true },
      { value: 'Excited', correct: true, feedback: 'Feeling excited about the fun activities and adventures at the beach.', draggable: true },
      { value: 'Sunny', correct: true, feedback: 'Enjoying the warmth and brightness of the sun at the beach.', draggable: true },
      { value: 'Refreshing', correct: true, feedback: 'Feeling refreshed by the cool breeze and ocean waves.', draggable: true },
      { value: 'Crowded', correct: false, feedback: 'Feeling overwhelmed by the large number of people at the beach.', draggable: true },
      { value: 'Boring', correct: false, feedback: 'Feeling unenthusiastic due to the lack of activities and excitement at the beach.', draggable: true },
      { value: 'Cloudy', correct: false, feedback: 'Being frustrated by the overcast weather and lack of sunshine at the beach.', draggable: true }
    ];
    this.droppedTags = [];
    this.isAnswered = false;
    this.feedbackMessage = '';
    this.imageData = ''; 
    this.question = '';
  }

  render() {
    return html`
      <div class="tagging-question-container">
        ${this.imageData ? html`<img src="${this.imageData}" alt="Question Image" class="question-image">` : ''}
        ${this.question ? html`<div class="question">${this.question}</div>` : ''}
        <div class="tags-container">
        ${this.tagData.map(
          (tag) => html`
            <div 
              class="tag ${tag.draggable ? '' : 'disabled'}" 
              draggable="${tag.draggable}" 
              @dragstart="${(e) => this.dragStart(e, tag)}"
            >
              ${tag.value}
            </div>
          `
        )}
      </div>
        <div 
          class="answer-area" 
          @dragover="${this.allowDrop}" 
          @drop="${this.drop}"
        >
          ${this.droppedTags ? this.droppedTags.map(tag => html`<div class="dropped-tag">${tag}</div>`) : ''}
        </div>
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
    const existingTag = this.droppedTags.find(tag => tag === draggedTag);
    if (!existingTag) {
      this.droppedTags = [...this.droppedTags, draggedTag];
      this.isAnswered = true;
      // Disable draggable attribute for the dropped tag
      this.tagData.forEach(tag => {
        if (tag.value === draggedTag) {
          tag.draggable = false;
        }
      });
    }
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
    this.droppedTags = [];
    this.isAnswered = false;
    this.feedbackMessage = '';
    // Reset draggable attribute for all tags
    this.tagData.forEach(tag => {
      tag.draggable = true;
    });
  }
}

customElements.define('tagging-question', TaggingQuestion);
