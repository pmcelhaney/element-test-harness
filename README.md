# Element Test Harness

This is a helper for testing custom elements built using Lit Element. It evolved from the practice of writing wrapper classes for custom elements so that the tests are easy to read and maintain.

For example, imagine a component that implements a calculator like the one built into iOS. Tests might look something like this.

```ts
import { html } from "lit";
import { TestHarness } from "@wh-hc-dev/element-test-harness";

import { MyCalculator } from "../src/my-calculator";

class CalculatorHarness extends TestHarness<MyCalculatorElement> {

  static events = ["calculationComplete"];

  static basic() {
    return this.fixture(html`<my-calculator></my-calculator>`)
  }

  static scientific() {
    return this.fixture(html`<my-calculator scientific></my-calculator>`)
  }

  async pressButtons(...buttons) {
    for (const button of buttons) {
      this.qs(`#${button}`).click();
    }

    await this.updateComplete();
  }

  get display() {
    return this.qs("#display").textContent();
  }

}


it("adds two numbers", async () => {
    const calculator = await CalculatorHarness.basic();

    await calculator.pressButtons(2, "+", 2, "="); 
    expect(calculator.display).toEqual("4")   ;
});

it("groups with parentheses", async () => {
    const calculator = await CalculatorHarness.scientific();

    await calculator.pressButtons(7, "*", "(", 5, "+", 2, ")"); 
    expect(calculator.display).toEqual("70")   
});

```

## Set Up

At the top of your test file (before any `it()` or `describe()` calls) create a subclass of `TestHarness`, passing your element as a type parameter.

```ts
import { TestHarness } from "@wh-hc-dev/element-test-harness";

import { MyElement } from "../src/my-element";

class MyTestHarness extends TestHarness<MyElement> {
 // intentionally left blank (for now)
}
```

To get an instance of your test harness, use the async static method, `fixture`.

```ts
const fixture = await MyTestHarness.fixture(document.createElement("my-element"));
```


In practice, it's helpful to add static methods to your subclass to get fixtures of elements that are configured with certain properties.


```ts
class MyTestHarness extends TestHarness<MyElement> {

  static simple() { 
    return this.fixture(document.createElement("my-element"));
  }

  static fancy({color}) { 
    return this.fixture(html`<my-element color=${color}></my-element>`);
  }
}

it("can be simple", async () => {
    const simple = await myTestHarness.simple();

    // ...
})


it("can be fancy", async () => {
    const fancy = await myTestHarness.fancy({color: "hotpink"});

    // ...
})
```

## API
### Querying the Shadow DOM

The `.qs()` method is a shorthand for `element.shadowDom.querySelector()`. 

```ts
const fixture = await MyTestHarness.fixture();
const button = fixture.qs<HTMLButtonElement>("#save-button");
```

If no matching element is not found, `qs()` will throw an error. If you want to test whether an element exists, uses `hasElementMatchingSelector()`

```ts
expect(fixture.hasElementMatchingSelector("#save-button")).toBe(true);
```

The `.qsa()` method is a shorthand for `element.shadowDom.querySelectorAll()`. It returns the list of matching items wrapped in an array, so you can call `map()`, `filter()`, `forEach()`, etc. (`querySelectorAll()` returns an iterable).


```ts
const fixture = await MyTestHarness.fixture();
const buttons = fixture.qsa<HTMLButtonElement>("button");
const buttonLabels = buttons.map(button => button.textContent);
```

### Changing Properties and Awaiting Updates

When properties are updated on a LitElement, the element doesn't rerender _immediately_. We need to wait for the `updateCompete` promise.

```ts
const fixture = await MyTestHarness.fixture();

expect(fixture.count).toEqual(0);
fixture.qs<HTMLButtonElement>("#increment").click();
expect(fixture.count).toEqual(0);
await fixture.updateComplete;
expect(fixture.count).toEqual(1);
```

### Verifying Events

TestHarness logs events that are emitted by the element (i.e. events that trigger on `element.addEventListener()`).

```ts
const fixture = await MyTestHarness.fixture();

const incrementButton = fixture.qs<HTMLButtonElement>("#increment");

increment.click();
increment.click();
increment.click();

expect(fixture.dispatchedEvents().length).toBe(3);
expect(fixture.lastEvent().target).toBe(incrementButton);

```

Note that in order for the test harness to listen for an event the type needs to be declared in the static property, `events`. 

```ts
class MyTestHarness extends TestHarness<MyCalculatorElement> {
  static events = ["calculationComplete"];
}
```

## Usage

In practice, you won't often access the methods and properties of `TestHarness` directly from the tests. Instead, you'll use them to build out your own harness, which is a subclass of `TestHarness`. 

Let's take a closer look at the calculator harness from the top again in more detail.

```ts
class CalculatorHarness extends TestHarness<MyCalculatorElement> {

  // declare the event types used in tests
  static events = ["calculationComplete"];

  /**
   * shortcut for a basic calculator
   */
  static basic() {
    return this.fixture(html`<my-calculator></my-calculator>`);
  }

  /** 
   * shortcut for a calculator instance with the "scientific" attribute enabled
   */
  static scientific() {
    return this.fixture(html`<my-calculator scientific></my-calculator>`);
  }

  /**
   * abstracts the act of clicking several buttons in a 
   * sequence and waiting for the component to re-render
   */
  async pressButtons(...buttons) {
    await Array.from(buttons).forEach(async button => {
        this.qs(`#${button}`).click();
        await this.updateComplete();
    })
  }

  /**
   * shortcut to the contents of the calculator display
   */
  get display() {
    return this.qs("#display").textContent();
  }

}
```

A well-designed harness encapsulates the grunt work of fiddling with the DOM so that the unit tests themselves are clear and concise. 





