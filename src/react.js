const hooks = [];
let currentComponent = 0;

export class Component {
    constructor(props){
        this.props = props;
    }
};

export function createDOM(node){
    if(typeof node === 'string'){
        return document.createTextNode(node);
    }
    const element = document.createElement(node.tag);

    Object.entries(node.props)
        .forEach(([key, value]) => element.setAttribute(key, value));

    node.children
        .map(createDOM)
        .forEach(element.appendChild.bind(element));

    return element;
};

function makeProps(props, children){
    return {
        ...props,
        children: children.length === 1 ? children[0] : children,
    }
};

function useState(initValue){
    let position = currentComponent - 1;
    
    if(!hooks[currentComponent]){
        hooks[currentComponent] = initValue;
    }

    const modifier = nextValue => {
        hooks[currentComponent] = nextValue;
    };

    return [hooks[currentComponent], modifier];
}

export function createElement(tag, props, ...children){
    props = props || {};

    if(typeof tag === 'function'){
        if(tag.prototype instanceof Component){
            const instance = new tag(makeProps(props, children))
            return instance.render();
        }else {

            hooks[currentComponent] = null;
            currentComponent++;

            if(children.length > 0){
                return tag(makeProps(props, children))
            }
            return tag(props, );
        }
    }else{
        return { tag, props, children };
    }
};

// export function render(vdom, container){
//     container.appendChild(createDOM(vdom));
// };

export const render = (function(){
    let prevDom = null;
    
    return function(vdom, container){
        if(prevDom === null){
            prevDom = vdom;
        }

        //diff

        container.appendChild(createDOM(vdom));
    }
})();