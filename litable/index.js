import { directive } from "lit-html";
export { html, render } from "lit-html";

const registry = new WeakMap();

export const litDirective = directive((ClassComponent, props) => (part) => {
  let myComponent = registry.get(part);

  // if we haven't mounted yet, create a new instance
  if (myComponent === undefined) {
    myComponent = new ClassComponent();
    myComponent.part = part;
    myComponent.props = props;
    registry.set(part, myComponent);
    part.setValue(myComponent.render());
    part.commit();
    window.requestAnimationFrame(
      myComponent.componentDidMount.bind(myComponent)
    );
  }
  // Otherwise, update the props and rerender
  else {
    myComponent.props = props;
    part.setValue(myComponent.render());
  }
});

export function litable(Class) {
  return (props) => {
    return litDirective(Class, props);
  };
}

export class Component {
  constructor(part) {
    this.part = part;
    this.state = {};
  }

  componentDidMount(props) {}

  setState(obj) {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        this.state[key] = obj[key];
      });
    }
    this.part.setValue(this.render());
    this.part.commit();
  }

  render() {}
}
