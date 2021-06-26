window.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items'),
          btn = document.querySelector('.btn');
    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
        item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }
    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((tab, i) => {
                if (tab === target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }

    });

    // Timer
    const deadline = '2021-09-21';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60) % 24)),
              minutes = Math.floor(t / (1000 / 60) % 60),
              seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);
        
        updateClock();
        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
            if (t.total <= 0) {
                clearInterval(timeInterval);
                days.innerHTML = '00';
                hours.innerHTML = '00';
                minutes.innerHTML = '00';
                seconds.innerHTML = '00';
            }
        }      
              
    }

    setClock('.timer', deadline);

    // Modals

    const modal = document.querySelector('.modal'),
          modalBtn = document.querySelectorAll('[data-modal]'),
          modalBtnClose = document.querySelectorAll('[data-close]');

    // let modalStyle = window.getComputedStyle(modal).diplay;
    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        // clearTimeout(modalTimerId);
    }

    modalBtn.forEach(btn => {
        btn.addEventListener('click', openModal);
    });


    function modalClose() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modalBtnClose.forEach(btn => {
        btn.addEventListener('click', modalClose);
    });

    // close modal if click out
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') === '') {
             modalClose();
        }
    });

    // close modal if press esc on keybord
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            modalClose();
            console.log('Escape');
        }
    });

    // todo timer for open modal in four sec
    // const modalTimerId = setTimeout(openModal, 4000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            // openModal();
            // remove the listener if scroll to end
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
   
    
    class MenuCards {
        constructor(src, alt, title, descr, price, parentElement, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.transfer = 75;
            this.valute = '$';
            this.parent = document.querySelector(parentElement);
            this.classes = classes;
            this.changeToRu();
        }
        
        changeToRu() {
            if (isFinite(this.price) && !isNaN(this.price)) { 
                this.price = this.price * this.transfer;
                this.valute = ' руб';
            }
        }
        
        render() {
            const elem = document.createElement('div');
            
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                elem.classList.add(this.element);
            } else {
                this.classes.forEach(className => elem.classList.add(className));
            }
            
            elem.innerHTML = `
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">Меню ${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span>${this.valute}/день</div>
            </div>`;
            this.parent.append(elem);
        }
        
    }
    function checkURL(url) {

        if (url === 'http://localhost:3000/menu') {
            getResource('http://localhost:3000/menu')
            .then(data => {
                    data.forEach(({img, altimg, title, descr, price}) => {
                        new MenuCards(img, altimg, title, descr, price, '.menu .container').render();
                    });
                });
        } else {
            new MenuCards("img/tabs/vegy.jpg", "vegy", 'Меню "Фитнес"', 'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 19, '.menu .container').render();

            new MenuCards("img/tabs/post.jpg", "vegy", 'Меню "Постное"', "Меню 'Постное' - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.", 39, '.menu .container').render();

            new MenuCards("img/tabs/elite.jpg","elite", "Меню 'Премиум'", "В меню 'Премиум' мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!", 49, '.menu .container').render();
        }
    }
    // classes for cards
    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        

        return await res.json();
    };
    checkURL('http://localhost:3000/menu1'); // ADD 1 FOR LOAD DB FROM JS FILE

    // getResource('http://localhost:3000/menu')
    // .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCards(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });

    // AJAX work with back-end and forms
    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/Spinner-3.gif',
        success: 'Thank you, we will soon call you back',
        failure: 'Somthing is going wrong...'
    };

    // using function postData for every forms on site
    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
                padding: 10px;
            `;
            form.insertAdjacentElement('afterend', statusMessage);
            
            // create form body for send meassage
            const formData = new FormData(form);

            // convert to object the formdata old method
            // const object = {};
            // formData.forEach(function(value, key) {
            //     object[key] = value;
            // });

            // convert to json new method
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(() => {
                // console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
                statusMessage.remove();
            }).finally(() => {
                form.reset();
            });

        }); 
    }

    // This function create html element for after user send forms
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>x</div>
                <div calss="modal__title">${message}</div>
            </div>
        `;
        modal.append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            modalClose();
        }, 4000);
    }

    // fetch('db.json')
    //     .then(data => data.json())
    //     .then(res => console.log(res));

    // Slider
    const sliderWrapper = document.querySelector('.offer__slider-wrapper'),
          sliderInner = document.querySelector('.offer__slider-inner'),
          widthWrapper = window.getComputedStyle(sliderWrapper).width,
          slidesTotal = document.querySelectorAll('.offer__slide'),totalSlides = document.querySelector('#total'),
          currentSlide = document.querySelector('#current'),
          prevBtn = document.querySelector('.offer__slider-prev'),
          nextBtn = document.querySelector('.offer__slider-next'),
          sliderText = document.querySelectorAll('.offer__advantages'),
          sliderTextWrapper = document.querySelector('.slider__text-wrapper'),
          widthTextWrapper = window.getComputedStyle(sliderTextWrapper).width,
          sliderTextInner = document.querySelector('.slider__text-inner');

    // Assign total value in numeric of total slides
    totalSlides.innerHTML = getZero(slidesTotal.length);

    
    let sliderIndex = 1;

    // Assign current value in numeric of current slide
    currentSlide.textContent = getZero(sliderIndex);
    let offset = 0;
    let offsetText = 0;
    /* 
        todo
        1) Need receive total widh for inner slides
        2) Assign style flex and transition for inner
        3) We need hidden all element which go beyond wrapper
        4) Assign widh for every element on inner
        5) Assign listener for btns
        7) Check cundition for offset
        6) Assign transform fro inner
        8) Check cudition sliderIndex
        9) Assign number for current slider number
    */

    function setPropertiesStyle(inner, wrapper, arr, width) {
        inner.style.width = 100 * arr.length + '%';
        inner.style.display = 'flex';
        inner.style.transition = '0.5s all';
        wrapper.style.overflow = 'hidden';
        arr.forEach(item => {
            item.style.width = width;
        });
        wrapper.style.width = width;
    }

    nextBtn.addEventListener('click', function() {
        if (offset === +widthWrapper.slice(0, widthWrapper.length - 2) * (slidesTotal.length - 1)) {
            offset = 0;
        } else {
            offset += parseInt(widthWrapper);
        }

        if (offsetText == parseInt(widthTextWrapper) * (sliderText.length - 1)) {
            offsetText = 0;
        } else {
            offsetText += parseInt(widthTextWrapper);
        }

        sliderInner.style.transform = `translateX(-${offset}px)`;
        sliderTextInner.style.transform = `translateX(-${offsetText}px)`;

        if (sliderIndex === slidesTotal.length) {
            sliderIndex = 1;
        } else {
            sliderIndex++;
        }
        currentSlide.textContent = getZero(sliderIndex);
    });

    prevBtn.addEventListener('click', () => {

        if (offset === 0) {
            offset = parseInt(widthWrapper) * (slidesTotal.length - 1);
        } else {
            offset -= parseInt(widthWrapper);
        }

        if (offsetText === 0) {
            offsetText = parseInt(widthTextWrapper) * (sliderText.length - 1);
        } else {
            offsetText -= parseInt(widthTextWrapper);
        }

        sliderInner.style.transform = `translateX(-${offset}px)`;
        sliderTextInner.style.transform = `translateX(-${offsetText}px)`;
        
        if (sliderIndex === 1) {
            sliderIndex = slidesTotal.length;
        } else {
            sliderIndex--;
        }
        currentSlide.textContent = getZero(sliderIndex);
    });

    setPropertiesStyle(sliderTextInner, sliderTextWrapper, sliderText, widthTextWrapper);
    setPropertiesStyle(sliderInner, sliderWrapper, slidesTotal, widthWrapper);

    ///////////////////////////

    //* easy method
    /* 
        todo 
        1) create function for cunditon index and hidden slides and set value current sliden in html current slide
        2) create function for increment index on function
        3) Add listener for btns

    */
    // function showSlides(n) {

    //     if (sliderIndex > slidesTotal.length) {
    //         sliderIndex = 1;
    //     }

    //     if (sliderIndex < 1) {
    //         sliderIndex = slidesTotal.length;
    //     }

    //     slidesTotal.forEach(item => item.style.display = 'none');
    //     slidesTotal[sliderIndex - 1].style.display = 'block';

    //     currentSlide.textContent = getZero(sliderIndex);
    // }

    // function plusSlides(n) {
    //     showSlides(sliderIndex += n);
    // }

    // nextBtn.addEventListener('click', () => {
    //     plusSlides(1);
    // });

    // prevBtn.addEventListener('click', () => {
    //     plusSlides(-1);
    // });
    // showSlides(sliderIndex);

});
