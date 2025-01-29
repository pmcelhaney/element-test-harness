import { LitElement, html, css } from "lit";

class HelloWorldElement extends LitElement {
  static properties = {
    name: { type: String },
  };

  constructor() {
    super();
    this.name = "World"; // Default name
  }

  render() {
    return html`
      <div>
        <h1>Hello, ${this.name}!</h1>
        <p>Welcome to Lit web components.</p>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      text-align: center;
      color: #333;
    }
    h1 {
      color: #007bff;
    }
  `;
}

customElements.define("hello-world-lit", HelloWorldElement);
