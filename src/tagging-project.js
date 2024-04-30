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

    .correct-tag {
      border: 2px solid #6bd425; 
    }

    .incorrect-tag {
      border: 2px solid #ff6961; 
    }

    .feedback {
      margin-top: 10px;
      display: flex;
      flex-direction: column; 
    }

    .feedback-message {
      margin-bottom: 5px; 
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
      justify-content: center;
    }
    .question-area {
      min-height: 100px;
      border: 2px dashed #ccc;
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
    }

    .faded-text {
      color: #999999;
      font-style: italic;
      text-align: center;
    }
    .tag.faded {
      opacity: 0.5;
    }

    .dropped-tag {
      background-color: #999999;
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

    .test{
      display: none;
    }

    .check-answer-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .question {
      text-align: center; 
      font-weight: bold; 
      margin-top: 10px; 
    }
    .question-image {
      display: block;
      margin: 0 auto; 
      border: 2px solid #ccc; 
      border-radius: 8px; 
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
    }
  `;
  static properties = {
    image: { type: String },
    question: { type: String },
    answerSet: { type: String },
    tagOptions: { type: Array },
    allTags: { type: Array },
    tagCorrect: { type: Array },
    tagFeedback: { type: Array },
    selectedTags: { type: Array },
    submitted: { type: Boolean },
    imageData: { type: String },
    feedbackMessage: { type: String },
    tagData: { type: Array },
    droppedTags: { type: Array },
    isAnswered: { type: Boolean },
  };

  constructor() {
    super();
    this.image = '';
    this.question = '';
    this.answerSet = 'default';
    this.tagOptions = [];
    this.allTags = [];
    this.tagCorrect = [];
    this.tagFeedback = [];
    this.selectedTags = [];
    this.submitted = false;
    this.imageData = '';
    this.feedbackMessage = '';
    this.tagData = [];
    this.droppedTags = [];
    this.isAnswered = false;
    this.loadTagsData();
  }

  async loadTagsData() {
    try {
      const response = await fetch('./src/tags.json');
      if (!response.ok) {
        throw new Error('Failed to fetch tags data');
      }
      const tagsData = await response.json();
      const tagSet = tagsData[this.answerSet];
      if (!tagSet) {
        throw new Error(`Tag set '${this.answerSet}' not found`);
      }
      this.tagData = tagSet.tagOptions.map(tag => ({
        value: tag,
        correct: false,
        feedback: ''
      }));
      tagSet.tagAnswers.forEach((tagAnswer) => {
        const tagKey = Object.keys(tagAnswer)[0];
        const { correct, feedback } = tagAnswer[tagKey];
        const tagIndex = this.tagData.findIndex(tag => tag.value === tagKey);
        if (tagIndex !== -1) {
          this.tagData[tagIndex].correct = correct;
          this.tagData[tagIndex].feedback = feedback;
        }
      });
      this.allTags = this.tagData.map(tag => tag.value);
    } catch (error) {
      console.error('Error loading tags data: ', error);
    }
  }

  render() {
    return html`
      <div class="tagging-question-container">
        ${this.imageData ? html`<img src="${this.imageData}" alt="Question Image" class="question-image">` : ''}
        ${this.question ? html`<div class="question">${this.question}</div>` : ''}
        <div class="question-area">
          ${this.tagData.map(
            (tag) => html`
              <div 
                class="tag ${this.droppedTags.includes(tag.value) ? '' : ''} ${tag.draggable ? '' : 'test'}" 
                draggable="${tag.draggable}" 
                @dragstart="${(e) => this.dragStart(e, tag)}"
                @click="${(e) => this.toggleTag(e, tag)}"
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
          ${this.droppedTags.length === 0 ? html`<div class="faded-text">Drag answers here</div>` : ''}
          ${this.droppedTags.map(tag => 
            html`<div class="dropped-tag ${this.getTagClass(tag)}" @click="${(e) => this.toggleTag(e, tag)}" draggable="true" @dragstart="${(e) => this.dragStart(e, tag)}">${tag}
           ${tag.value}  ${tag.feedbackMessage}
           </div>`
          )}
          
        </div>
        
        <div class="feedback">
            ${this.feedbackMessage.split('\n').map(message => html`<div class="feedback-message">${message}</div>
            `)}
          </div>
        <button class="check-answer-btn" ?disabled="${!this.isAnswered}" @click="${this.checkAnswer}">Check Answer</button>
        <button class="reset-btn" @click="${this.reset}">Reset</button>
      </div>
    `;
  }
  
  toggleTag(e, tag) {
  if (!this.isAnswered) {
    const isInAnswerBox = this.droppedTags.includes(tag.value);
    if (isInAnswerBox) {
      const droppedTagIndex = this.droppedTags.indexOf(tag.value);
      this.droppedTags.splice(droppedTagIndex, 1);
    } else {
      this.droppedTags.push(tag.value);
    }
    this.requestUpdate();
  }
}
  

  dragStart(e, tag) {
  e.dataTransfer.setData('text/plain', tag.value);
}

  allowDrop(e) {
    e.preventDefault();
  }

  drop(e) {
    e.preventDefault();
    if (!this.isAnswered) {
      const draggedTag = e.dataTransfer.getData('text/plain');
      const existingTagIndex = this.droppedTags.indexOf(draggedTag);
      if (existingTagIndex !== -1) {
        this.droppedTags.splice(existingTagIndex, 1);
      }
      this.droppedTags.push(draggedTag);
      this.isAnswered = true;
    }
  }

  checkAnswer() {
    this.feedbackMessage = '';
    this.droppedTags.forEach((tag) => {
      const index = this.allTags.indexOf(tag);
      if (index !== -1) {
        const correct = this.tagCorrect[index];
        const feedback = this.tagFeedback[index];
        this.feedbackMessage += `${tag} - ${correct ? 'Correct!' : 'Incorrect!'} - ${feedback}\n`;
      }
    });
  }

  reset() {
    this.droppedTags = [];
    this.isAnswered = false;
    this.feedbackMessage = '';
  }
}

customElements.define('tagging-question', TaggingQuestion);