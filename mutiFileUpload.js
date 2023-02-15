const uploadInput = document.querySelectorAll('input[type=file]');
const uploadLabel = document.querySelectorAll('.upload_label');
const viewWrap = document.querySelectorAll('.view_wrap');

/* 업로드시 change 이벤트  */
uploadInput.forEach((input) => {
  input.addEventListener('change', changeHandler);
});

/* 드래그 이벤트 */
uploadLabel.forEach((label) => {
  label.addEventListener('dragenter', dragEnterHandler);
});
uploadLabel.forEach((label) => {
  label.addEventListener('dragleave', dragLeaveHandler);
});
uploadLabel.forEach((label) => {
  label.addEventListener('dragover', dragOverHandler);
});
uploadLabel.forEach((label) => {
  label.addEventListener('drop', dropHandler);
});

/**
 * dragenter 이벤트 함수
 * 드래그 된 요소가 드롭 대상에 들어갈 때
 */
function dragEnterHandler(event) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * dragleave 이벤트 함수
 * 드래그된 요소가 드롭 타겟 떠날때 ex) mouseleave
 */
function dragLeaveHandler(event) {
  event.preventDefault();
  event.stopPropagation();
  event.target.classList.remove('on');
}

/**
 * dragover 이벤트 함수
 * 드래그 된 요소가 드롭 대상 위에있을 때 ex) mouseenter
 */
function dragOverHandler(event) {
  event.preventDefault();
  event.stopPropagation();
  event.target.classList.add('on');
}

/**
 * drop 이벤트 함수
 * 드래그 된 요소가 드롭 되었을때.
 */
function dropHandler(event) {
  event.preventDefault();
  event.stopPropagation();

  let files = event.dataTransfer.files[0]; // 드래그 파일 리스트
  event.target.classList.remove('on');
  viewImageHandler(files, event);
}

/**
 * Input 체인지 이벤트 핸들러
 */
function changeHandler(event) {
  let files = event.target.files[0]; // input 파일 리스트
  viewImageHandler(files, event);
}

/**
 * 이미지 닫기 클릭시 이미지 item 삭제
 * @param target - 삭제 시킬 대상 부모 div
 * @param label - 라벨 엘리먼트
 */
function closeImageHandler(target, label) {
  const removeTargetElement = target.querySelector('button');
  const nextInput = label.nextElementSibling;
  removeTargetElement.addEventListener('click', () => {
    nextInput.value = '';
    label.style.display = 'flex';
    removeTargetElement.parentElement.remove();
  });
}

/**
 *  FileReader 브라우저 뷰에 이미지 보여주기
 * @param {*} fileList - input 및 드래그에 들어가는 파일 요소
 * @param {*} targetElement - 드래그 될 대상 엘리먼트
 */
function viewImageHandler(fileList, targetElement) {
  const reader = new FileReader();
  const viewWrap = targetElement.target.closest('.upload_wrap').querySelector('.view_wrap');
  const labelWrap = viewWrap.closest('.upload_wrap').querySelector('.upload_label');

  reader.addEventListener('load', (event) => {
    const elements = createElementImage(event);

    if (fileList.type === 'image/jpeg' || fileList.type === 'image/jpg' || fileList.type === 'image/png') {
      viewWrap.append(elements);
      viewWrap.style.display = 'block';
      labelWrap.style.display = 'none';
      expandImage(elements);
      closeImageHandler(elements, labelWrap);
    } else {
      alert('유효한 확장자가 아닙니다.');
    }
  });
  reader.readAsDataURL(fileList);
}

/**
 * 파일 생성시 이미지 엘리먼트 추가
 * @param event - event 대상
 */
function createElementImage(event) {
  const div = document.createElement('div');
  const button = document.createElement('button');
  const img = document.createElement('img');
  img.setAttribute('src', event.target.result);
  button.className = 'delete_file_btn';
  div.append(button);
  div.append(img);
  return div;
}

/**
 * 확대 이미지 보기
 * @param {*} ele 추가될 이미지 부모 li 엘리먼트
 */
function expandImage(ele) {
  const target = ele.querySelector('img');
  target.addEventListener('click', () => {
    const eleChildImage = target.src;
    const div = document.createElement('div');
    const img = document.createElement('img');
    img.src = eleChildImage;
    div.append(img);
    div.classList.add('view_modal');
    div.style.position = 'fixed';
    div.style.top = '0px';
    div.style.left = '0px';
    div.style.backgroundColor = 'rgba(0, 0, 0, .7)';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.zIndex = '2000';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.style.overflowY = 'auto';
    img.style.maxWidth = '80%';
    img.style.maxHeight = '80%';
    document.body.append(div);
    document.querySelector('.view_modal').addEventListener('click', (ev) => {
      if (ev.currentTarget === document.querySelector('.view_modal')) {
        document.querySelector('.view_modal').remove();
      }
    });
  });
}

/**
 * 이미지 불러오기 함수
 * @param srcImage - 이미지 주소
 * @param index - 추가될 엘리먼트 index, index 0부터 시작
 * */

function addFileImage(srcImage, index = 0) {
  const targetElement = document.querySelectorAll('[data-idx]');
  const viewElement = targetElement[index].querySelector('.view_wrap');
  const labelWrap = viewElement.closest('.upload_wrap').querySelector('.upload_label');

  viewElement.style.display = 'block';
  labelWrap.style.display = 'none';
  const div = document.createElement('div');
  const button = document.createElement('button');
  button.className = 'delete_file_btn';
  const img = document.createElement('img');
  img.src = srcImage;
  div.append(button);
  div.append(img);
  closeImageHandler(div, labelWrap);
  expandImage(div);

  if (viewElement.children.length > 0) {
    return;
  }

  return viewElement.append(div);
}
