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
  };

  constructor() {
    super();
    this.tagData = [
      { value: 'good form', correct: true, feedback: 'The shape of the vase clearly demonstrates craftsmanship' },
      { value: 'poor taste', correct: false, feedback: 'Taste is in the eye of the designer as well as the viewer.' }
    ];
    this.droppedTag = '';
    this.isAnswered = false;
  }

  render() {
    return html`
      <div class="tagging-question-container">
        <div class="tags-container">
          <!-- Draggable tags -->
          ${this.tagData.map(
            (tag) => html`
              <div 
                class="tag ${tag.correct ? 'correct' : 'incorrect'}" 
                draggable="true" 
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
          <!-- Answer area where tags will be dropped -->
          ${this.droppedTag ? html`${this.droppedTag}` : ''}
        </div>
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
    const tagValue = e.dataTransfer.getData('text/plain');
    console.log('Dropped tag:', tagValue);
    this.droppedTag = tagValue;
    this.isAnswered = true;
  }

  checkAnswer() {
    console.log('Checking answer...');
  }

  reset() {
    this.droppedTag = '';
    this.isAnswered = false;
  }
}

customElements.define('tagging-question', TaggingQuestion);