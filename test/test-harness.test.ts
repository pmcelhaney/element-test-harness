/* eslint-disable sonarjs/no-duplicate-string */
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { TestHarness } from "../src/test-harness";

// eslint-disable-next-line @walgreenshealth/element-export-name
class MyElement extends LitElement {
  @property({ type: Number }) counter = 0;

  render() {
    return html`
      <div id="counter">${this.counter}</div>
      <span class="stooge" id="larry"></span>
      <span class="stooge" id="curly"></span>
      <span class="stooge" id="moe"></span>
    `;
  }
}

class MyEvent extends Event {
  sequence: number;

  constructor(type: string, sequence: number) {
    super(type);
    this.sequence = sequence;
  }
}

customElements.define("my-element", MyElement);

class MyTestHarness extends TestHarness<MyElement> {
  static eventTypes = ["a", "b"];

  static async simple() {
    return await this.fixture(document.createElement("my-element"));
  }
}

describe("TestHarness", () => {
  it("element", async () => {
    const harness = await MyTestHarness.simple();

    expect(harness.element.tagName).toEqual("MY-ELEMENT");
  });

  it("shadowRoot", async () => {
    const harness = await MyTestHarness.simple();

    expect(harness.shadowRoot).toBe(harness.element.shadowRoot);
  });

  it("qs()", async () => {
    const harness = await MyTestHarness.simple();

    expect(harness.qs(".stooge").id).toBe("larry");
    expect(harness.qs("span:nth-of-type(2)").id).toBe("curly");
    expect(harness.qs(".stooge:last-child").id).toBe("moe");
  });

  it("qs() - no match", async () => {
    const harness = await MyTestHarness.simple();

    expect(() => harness.qs(".does-not-exist")).toThrow();
  });

  it("qsa() - like querySelectorAll, but an array", async () => {
    const harness = await MyTestHarness.simple();

    expect(harness.qsa(".stooge").length).toBe(3);
  });

  it("hasElementMatchingSelector() - no match", async () => {
    const harness = await MyTestHarness.simple();

    expect(harness.hasElementMatchingSelector(".does-not-exist")).toBe(false);
    expect(harness.hasElementMatchingSelector(".stooge")).toBe(true);
  });

  it("updateComplete", async () => {
    const harness = await MyTestHarness.simple();

    harness.element.counter = 1;
    expect(harness.qs("#counter").textContent).toBe("0");

    await harness.updateComplete;

    expect(harness.qs("#counter").textContent).toBe("1");
    expect(harness.qsa(".stooge").length).toBe(3);
  });

  it("lastEvent", async () => {
    const harness = await MyTestHarness.fixture(
      document.createElement("my-element")
    );
    harness.element.dispatchEvent(new MyEvent("a", 1));
    harness.element.dispatchEvent(new MyEvent("a", 2));
    harness.element.dispatchEvent(new MyEvent("b", 3));

    expect(harness.lastEvent<MyEvent>("b")?.sequence).toEqual(3);
    expect(harness.lastEvent<MyEvent>("a")?.sequence).toEqual(2);
  });

  it("lastEvent throws an error if the event type isn't listed", async () => {
    const harness = await MyTestHarness.fixture(
      document.createElement("my-element")
    );
    harness.element.dispatchEvent(new MyEvent("missing", 1));

    expect(() => harness.lastEvent<MyEvent>("missing")).toThrow(
      // eslint-disable-next-line max-len
      "The harness is not listening for 'missing' events. To fix this error, add \"missing\" to your MyTestHarness class:\n\nstatic eventTypes = ['a', 'b', 'missing'];"
    );
  });

  it("lastEvent throws an error if eventTypes are not declared", async () => {
    class EmptyTestHarness extends TestHarness<MyElement> {}

    const harness = await EmptyTestHarness.fixture(
      document.createElement("my-element")
    );
    harness.element.dispatchEvent(new MyEvent("missing", 1));

    expect(() => harness.lastEvent<MyEvent>("missing")).toThrow(
      // eslint-disable-next-line max-len
      "The harness is not listening for 'missing' events. To fix this error, add the following line to your EmptyTestHarness class:\n\nstatic eventTypes = ['missing'];"
    );
  });
});
