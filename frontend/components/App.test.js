import AppClass from "./AppClass";

describe("Render Functional Component", () => {
  test("AppClass is a class-based component, Review how to build a class-based component, such as using “extends”, and constructors", () => {
    expect(
      AppClass.prototype && AppClass.prototype.isReactComponent
    ).toBeTruthy();
  });
});
