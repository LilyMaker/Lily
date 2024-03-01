try{
    // 获取需要复制并移动的元素
//alert("复制成功");
var elementToCopy = document.getElementById('scbar_form'); // 替换为实际要复制的元素ID

// 创建元素的克隆节点
var clonedElement = elementToCopy.cloneNode(true); // true表示深拷贝，包括所有子元素及其属性
// 获取目标容器元素
var targetContainer = document.querySelector('.header-stackup .wp.cl'); // 替换为目标容器元素ID

// 确定要插入的位置索引 n
var positionIndex = 1; // 假设您要插入到第3个位置（索引从0开始）

// 将克隆节点插入到目标容器内指定的位置
if (targetContainer.children.length >= positionIndex) {
    targetContainer.insertBefore(clonedElement, targetContainer.children[positionIndex]);
} else {
    // 如果目标位置超过目标容器子元素数量，则添加到最后
    targetContainer.appendChild(clonedElement);
}

}catch(e){
    
}