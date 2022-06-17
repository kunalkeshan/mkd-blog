/**
 * Common JS Func
 */

// DOM Elements
const _successModal = document.getElementById('success-modal');
const _errorModal = document.getElementById('error-modal');

class Modal {
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.title = this.parentElement.querySelector('h3');
        this.content = this.parentElement.querySelector('p');
        this.button = this.parentElement.querySelector('button');
        this.AUTO_CLOSE = 6000; // 6 Seconds

        this.button.addEventListener('click', this.close);
    }

    open(title = '', content = '') {
        this.parentElement.style.display = 'block';
        this.title.textContent = title;
        this.content.textContent = content;
        setTimeout(() => {
            this.close();
        }, this.AUTO_CLOSE)
    }

    close() {
        this.parentElement.style.display = 'none';
        this.resetModal();
    }

    resetModal() {
        this.title.textContent = '';
        this.content.textContent = '';
    }
}

export const successModal = new Modal(_successModal);
export const errorModal = new Modal(_errorModal);
