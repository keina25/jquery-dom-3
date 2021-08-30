window.$ = window.jQuery = function(selectorOrArrayOrTemplate) {
  let elements;
  if (typeof selectorOrArrayOrTemplate === "string") {
    if (selectorOrArrayOrTemplate[0] === "<") {
      // 创建 div
      elements = [createElement(selectorOrArrayOrTemplate)];
    } else {
      // 查找 div
      elements = document.querySelectorAll(selectorOrArrayOrTemplate);
    }
  } else if (selectorOrArrayOrTemplate instanceof Array) {
    elements = selectorOrArrayOrTemplate;
  }
//这就是重载

    function createElement(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }
  // api 可以操作elements
    const api = Object.create(jQuery.prototype) //创建一个对象，这个对象的__proto__为括号里面的东西
    //相当于const api = {__proto__:jQuery.prototype} ,一开始就把两个的共有属性固定好了，之后再api上面加这两个属性（下面
    Object.assign(api,{
        elements: elements,
        oldApi: selectorOrArrayOrTemplate.oldApi
    }) //assign意思就是把后面这两个属性一个一个复制到前面来，比如把elements复制到api的elements，等等
    //api.elements = elements 这是属性 = 变量
    //api.oldApi = selectorOrArrayOrTemplate.oldApi
    return api
};//这样就做到内存的节约，共有属性


jQuery.fn = jQuery.prototype = { //jQuery这样命名别名
    constructor:jQuery,
    jquery:true,
    get(index){
        return this.elements[index];  //这是一个属性
    },//这就是闭包，好处就是用户不能通过elements来操作，只能通过get,find来操作elements,隐藏细节
    appendTo(node){
        if(node instanceof Element){
            this.each(el => node.appendChild(el));
        }else if(node.jquery === true){
            this.each(el =>node.get(0).appendChild(el));
        }
    },
    append(children){
        if(children instanceof element){
            this.get(0).appendChild(children);
        }else if(children instanceof HTMLCollection){
            for(let i = 0;i<children.length;i++){
                this.get(0).appendChild(children[i]);
            }
        }else if(children.jquery === true){
            children.each(node=>this.get(0).appendChild(node));
        }
    },
    find(selector){
        let array = [];
        for(let i = 0; i< this.elements.length;i++){
            const elements2 = Array.from(this.elements[i].querySelectorAll(selector));
            array = array.concat(this.elements2);
        }
        array.oldApi = this; //this就是旧的api
        return jQuery(array);
    },
    each(fn){
        for(let i = 0; this.elements.length; i++){
            fn.call(null,this.elements[i],i);
        }
        return this;
    },
    parent(){
        const array = [];
        this.each(node =>{
            if(array.indexOf(node.parentNode) === -1){
                array.push(node.parentNode);
            }
        });
        return jQuery(array);
    },
    children(){
        const array = [];
        this.each(node => {
            if(array.indexOf(node.parentNode) === -1){
                array.push(... node.children);
            }
        });
        return jQuery(array);
        },
        print(){
            console.log(this.elements);
        },
        //闭包：函数访问外部的变量
        addClass(className){
            for(let i = 0; i < this.elements.length;i++){
                const element = this.elements[i];
                element.classList.add(className);
            }
            return this;
        },
        end(){
            return this.oldApi; //this就是新api
        }
    }