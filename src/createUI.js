import globalObj from './variables.js';
import * as Tree from './makeTree.js';
import './style.css';

export default function createUI(){
    var element = document.createElement('div');

    element.innerHTML = "TreeBuilder";
    element.classList.add('hello');

    var branchLabel = document.createElement('label');
    branchLabel.innerHTML = "number of branches: ";

    var branchInput = document.createElement('select');    
    for(let i = 1;i<=globalObj.MAX_BRANCH;i++)  branchInput.appendChild(createOption(i));
    branchInput.id = "branchInput";
    branchInput.style.width = '100px';

    var recurLabel = document.createElement('label');
    recurLabel.innerHTML = "tree depth: ";

    var recurInput = document.createElement('select');
    for(let i = 1;i<=globalObj.MAX_BRANCH;i++)  recurInput.appendChild(createOption(i));
    recurInput.id = "recurInput";

    const btn = document.createElement('button');
    btn.innerHTML = "RUN";
    btn.onclick = Tree.createTree;


    var rotateLabel = document.createElement('label');
    rotateLabel.innerHTML = "Rotate!";

    const rotateBranches = document.createElement('input');
    rotateBranches.type = 'checkbox';
    rotateBranches.id = "rotateBox";
    rotateBranches.style.color = "#fb5858";

    element.appendChild(branchLabel);
    element.appendChild(branchInput);
    element.appendChild(recurLabel);
    element.appendChild(recurInput);
    element.appendChild(btn);
    element.appendChild(rotateLabel);
    element.appendChild(rotateBranches);

    element.appendChild(globalObj.renderer.domElement);
    document.body.appendChild(element);
}


function createOption(val){
    var branchOption = document.createElement('option');
    branchOption.setAttribute('value', val);
    var txt = document.createTextNode(val+'');
    branchOption.appendChild(txt);
    return branchOption;
}