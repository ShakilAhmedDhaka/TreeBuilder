import globalObj from './variables.js';
import * as Tree from './makeTree.js';

export default function createUI(){
    var element = document.createElement('div');

    element.innerHTML = "TreeBuilder";
    element.classList.add('hello');

    var branchLabel = document.createElement('label');
    branchLabel.innerHTML = "number of branches: ";
    branchLabel.style.marginLeft = "20px";
    branchLabel.style.color = "#377B8C";

    var branchInput = document.createElement('input');
    branchInput.type = 'number';
    branchInput.min = 1;
    branchInput.max = globalObj.MAX_BRANCH;
    branchInput.style.width = '40px';
    branchInput.id = "branchInput";

    var recurLabel = document.createElement('label');
    recurLabel.innerHTML = "tree depth: ";
    recurLabel.style.marginLeft = "20px";
    recurLabel.style.color = "#377B8C";

    var recurInput = document.createElement('input');
    recurInput.type = 'number';
    recurInput.min = 1;
    recurInput.max = globalObj.MAX_RECUR;
    recurInput.style.width = '40px';
    recurInput.id = "recurInput";

    const btn = document.createElement('button');
    btn.innerHTML = "RUN";
    btn.onclick = Tree.createTree;
    btn.style.marginLeft = "20px";
    btn.style.color = "#fb5858";


    var rotateLabel = document.createElement('label');
    rotateLabel.innerHTML = "Rotate!";
    rotateLabel.style.marginLeft = "20px";
    rotateLabel.style.color = "#377B8C";

    const rotateBranches = document.createElement('input');
    rotateBranches.type = 'checkbox';
    rotateBranches.id = "rotateBox";
    rotateBranches.style.marginLeft = "20px";
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