class HelloWorldElement extends HTMLElement {
  static get observedAttributes() {
    return ["name"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.name = "World"; // Default name
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "name" && oldValue !== newValue) {
      this.name = newValue;
      this.render();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          text-align: center;
          color: #333;
        }
        h1 {
          color: #007bff;
        }
      </style>
      <div>
        <h1>Hello, ${this.name}!</h1>
        <p>Welcome to standard Web Components.</p>
      </div>
    `;
  }
}

customElements.define("hello-world", HelloWorldElement);
