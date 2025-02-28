# Element Test Harness

Element Test Harness is a utility for testing custom elements built using LitElement. It simplifies the process of writing and maintaining tests by providing a convenient wrapper class for custom elements.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Tutorial](#tutorial)
- [API Reference](#api-reference)
- [Contributing](#contributing)

## Installation

To install Element Test Harness, use npm or yarn:

```sh
npm install @wh-hc-dev/element-test-harness
```

or

```sh
yarn add @wh-hc-dev/element-test-harness
```

## Usage

Here's an example of how to use Element Test Harness to test a custom element:

```ts
import { html } from "lit";
import { TestHarness } from "@wh-hc-dev/element-test-harness";
import "../src/hello-world.js";

class HelloWorldHarness extends TestHarness {
  static withName(name) {
    return this.fixture(html`<hello-world .name=${name}></hello-world>`);
  }

  get title() {
    return this.qs("h1").textContent;
  }
}

describe("A <hello-world> element", () => {
  it("displays the name", async () => {
    const fixture = await HelloWorldHarness.withName("Patrick");

    expect(fixture.title).toEqual("Hello, Patrick!");
  });
});
```

## Tutorial

### Introduction

This tutorial will guide you through the process of using the Element Test Harness to test custom elements.

### Step 1: Create a Custom Element

First, create a custom element. For this example, we'll create a simple "hello-world" element.

```js
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
```

### Step 2: Create a Test Harness

Next, create a test harness for the custom element.

```ts
import { TestHarness } from "@wh-hc-dev/element-test-harness";
import { html } from "lit";
import "../src/hello-world.js";

class HelloWorldHarness extends TestHarness {
  static withName(name) {
    return this.fixture(html`<hello-world .name=${name}></hello-world>`);
  }

  get title() {
    return this.qs("h1").textContent;
  }
}
```

### Step 3: Write Tests

Finally, write tests for the custom element using the test harness.

```ts
describe("A <hello-world> element", () => {
  it("displays the name", async () => {
    const fixture = await HelloWorldHarness.withName("Patrick");

    expect(fixture.title).toEqual("Hello, Patrick!");
  });
});
```

## API Reference

### TestHarness Class

The `TestHarness` class is a base class for creating test harnesses for custom elements.

#### Methods

- `static async fixture(html: LitHTMLRenderable): Promise<TestHarness>`
  - Creates a fixture for the custom element.

- `qs<E extends Element>(selector: string): E`
  - Shortcut to the element's shadowRoot.querySelector().

- `qsa<E extends Element>(selector: string): E[]`
  - Shortcut to the element's shadowRoot.querySelectorAll().

- `hasElementMatchingSelector(selector: string): boolean`
  - Checks if at least one element matches the selector.

- `lastEvent<E extends Event>(eventType: string): E | undefined`
  - Returns the last event matching the type received by the element.

- `get updateComplete(): Promise<boolean>`
  - Shortcut to the element's updateComplete property.

#### Properties

- `element: T`
  - The custom element under test.

- `dispatchedEvents: { type: string; event: Event }[]`
  - All of the events that the element received from below or dispatched itself.

#### Example

```ts
import { LitElement, html } from "lit";
import { TestHarness } from "@wh-hc-dev/element-test-harness";

class MyElement extends LitElement {
  render() {
    return html`<div>Hello, World!</div>`;
  }
}

customElements.define("my-element", MyElement);

class MyElementHarness extends TestHarness<MyElement> {
  static async create() {
    return this.fixture(html`<my-element></my-element>`);
  }
}

describe("MyElement", () => {
  it("renders correctly", async () => {
    const harness = await MyElementHarness.create();
    expect(harness.qs("div").textContent).toBe("Hello, World!");
  });
});
```

## Contributing

We welcome contributions to the Element Test Harness project. If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request on GitHub.
