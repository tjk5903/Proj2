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
    tagData: { type: Array },
    droppedTags: { type: Array },
    isAnswered: { type: Boolean },
    imageData: { type: String },
    question: { type: String },
    feedbackMessage: { type: String },
    showFeedback: { type: Boolean }
  };

  constructor() {
    super();
    this.question = '';
    this.tagData = [];
    this.droppedTags = [];
    this.answerTags = [];
    this.correctTags = [];
    this.isAnswered = false;
    this.feedbackMessage = '';
    this.showFeedback = false;
    this.imageData = 'https://t3.ftcdn.net/jpg/02/43/25/90/360_F_243259090_crbVsAqKF3PC2jk2eKiUwZHBPH8Q6y9Y.jpg'; 
    this.question = '';
    this.tagData = [
      { value: 'Relaxing', correct: true, feedback: 'Feeling relaxed while enjoying the calm atmosphere of the beach.', draggable: true },
      { value: 'Refreshing', correct: true, feedback: 'Feeling refreshed by the cool breeze and ocean waves.', draggable: true },
      { value: 'Crowded', correct: false, feedback: 'Feeling overwhelmed by the large number of people at the beach.', draggable: true },
      { value: 'Exciting', correct: true, feedback: 'Feeling excited about the fun activities and adventures at the beach.', draggable: true },
      { value: 'Boring', correct: false, feedback: 'Feeling unenthusiastic due to the lack of activities and excitement at the beach.', draggable: true },
      { value: 'Cloudy', correct: false, feedback: 'Being frustrated by the overcast weather and lack of sunshine at the beach.', draggable: true },
      { value: 'Sunny', correct: true, feedback: 'Enjoying the warmth and brightness of the sun at the beach.', draggable: true }
    ];
  }

  loadTagsData(tagSetName) {
    fetch("./assets/tags.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch tags data");
        }
        return response.json();
      })
      .then(tagsData => {
        const tagSet = tagsData[tagSetName];
        if (tagSet) {
          this.tagData = tagSet.tagOptions.map(tag => ({
            value: tag,
            correct: false, // You may set this based on tag answers
            feedback: '', // You may set this based on tag answers
            draggable: true // Set to true initially
          }));
        } else {
          throw new Error(`Tag set '${tagSetName}' not found in tags.json`);
        }
      })
      .catch(error => {
        console.error("Error loading tags data: ", error);
      });
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
          ${this.feedbackMessage.split('\n').map(message => html`<div class="feedback-message">${message}</div>`)}
        </div>
        <button class="check-answer-btn" ?disabled="${!this.isAnswered}" @click="${this.checkAnswer}">Check Answer</button>
        <button class="reset-btn" @click="${this.reset}">Reset</button>
      </div>
    `;
  }
  
  toggleTag(e, tag) {
    const isInAnswerBox = this.droppedTags.includes(tag.value);
    if (isInAnswerBox) {
      const droppedTagIndex = this.droppedTags.indexOf(tag.value);
      this.droppedTags.splice(droppedTagIndex, 1);
      const originalTag = this.tagData.find(item => item.value === tag.value);
      if (originalTag) {
        originalTag.draggable = true;
      }
    } else {
      this.droppedTags.push(tag.value);
      tag.draggable = false;
    }
    this.isAnswered = this.droppedTags.length > 0;
    this.requestUpdate();
  }
  
  
  getTagClass(tag) {
    if (this.showFeedback) {
      const correct = this.tagData.find(item => item.value === tag)?.correct;
      return correct ? 'correct-tag' : 'incorrect-tag';
    } else {
      return '';
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
    const draggedTag = e.dataTransfer.getData('text/plain');
    const existingTagIndex = this.droppedTags.indexOf(draggedTag);
    
    if (existingTagIndex !== -1) {
      this.droppedTags.splice(existingTagIndex, 1);
      const originalTag = this.tagData.find(item => item.value === draggedTag);
      if (originalTag) {
        originalTag.draggable = false;
      }
    } else {
      this.droppedTags = [...this.droppedTags, draggedTag];
      this.tagData.forEach(tag => {
        if (tag.value === draggedTag) {
          tag.draggable = false;
        }
      });
    }
    // Check if there are any tags in the answer box
    this.isAnswered = this.droppedTags.length > 0;
  }

  checkAnswer() {
    this.feedbackMessage = ''; // Clear previous feedback messages
    this.showFeedback = true;
    this.droppedTags.forEach((tag) => {
        const tagItem = this.tagData.find(item => item.value === tag);
        if (tagItem) {
            if (tagItem.correct) {
                this.feedbackMessage += `Correct! - ${tagItem.feedback}`;
            } else {
                this.feedbackMessage += `Incorrect! - ${tagItem.feedback}`;
            }
        }
    });
}

makeItRain() {
  const allCorrect = this.selectedTags.every(tag => this.isTagCorrect(tag));

  if (allCorrect) {
    import('@lrnwebcomponents/multiple-choice/lib/confetti-container.js').then((module) => {
      setTimeout(() => {
        this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
      }, 0);
    });
  }
}

  reset() {
    this.droppedTags = [];
    this.answerTags = [];
    this.isAnswered = false;
    this.feedbackMessage = '';
    // Reset draggable attribute for all tags
    this.tagData.forEach(tag => {
      tag.draggable = true;
    });
  }
}


customElements.define('tagging-question', TaggingQuestion);