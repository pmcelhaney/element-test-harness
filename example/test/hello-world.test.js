import { TestHarness } from "element-test-harness";
import { html } from "lit";
import "../src/hello-world.js";


class Harness extends TestHarness {
  static withName(name) {
    return this.fixture(html`<hello-world .name=${name}></hello-world>`);
  }

   get title() {
    return this.qs("h1").textContent;
  }
}

describe("A <hello-world> element", () => {
  it("displays the name", async () => {
    const fixture = await Harness.withName("Patrick");

    expect(fixture.title).toEqual("Hello, Patrick!");
  });
});
