// kwf.js

// จัดการเมนูบนมือถือ
function initializeMobileMenu() {
    const menuButton = document.querySelector('.menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuButton && mobileMenu) {
        // เปิด-ปิดเมนูเมื่อกดปุ่ม
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // ปิดเมนูเมื่อคลิกด้านนอก
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
        
        // ปิดเมนูเมื่อคลิกที่ลิงก์
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// จัดการการเปลี่ยนขนาดหน้าจอ
function handleResize() {
    const width = window.innerWidth;
    const elements = document.querySelectorAll('[data-responsive]');
    
    // ปรับการแสดงผลตามขนาดหน้าจอ
    elements.forEach(element => {
        const breakpoint = element.dataset.responsive;
        if (width < parseInt(breakpoint)) {
            element.classList.add('responsive-hidden');
        } else {
            element.classList.remove('responsive-hidden');
        }
    });
}

// จัดการการโหลดรูปภาพแบบ lazy
function initializeResponsiveImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    // ตรวจสอบว่าเบราว์เซอร์รองรับ IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // สำหรับเบราว์เซอร์เก่า
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// จัดการการส่งฟอร์ม
function initializeForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // ปิดปุ่มระหว่างการส่งข้อมูล
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = 'กำลังส่ง...';
            
            try {
                // เพิ่มโค้ดสำหรับส่งข้อมูลฟอร์มที่นี่
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // แสดงข้อความสำเร็จ
                alert('ขอบคุณสำหรับข้อความ เราจะติดต่อกลับโดยเร็วที่สุด');
                form.reset();
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการส่งฟอร์ม:', error);
                alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            } finally {
                // เปิดปุ่มอีกครั้ง
                submitButton.disabled = false;
                submitButton.innerHTML = 'ส่งข้อความ';
            }
        });
    }
}

// จัดการการนำทาง
function initializeNavigation() {
    // Smooth scroll สำหรับลิงก์ภายใน
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // คำนวณระยะห่างจาก navbar
                const header = document.querySelector('.navbar');
                const headerHeight = header ? header.offsetHeight : 0;
                
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // เลื่อนไปยังตำแหน่งที่ต้องการ
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // อัพเดท URL โดยไม่ reload หน้า
                history.pushState(null, '', targetId);
            }
        });
    });
}

// เพิ่มฟังก์ชันจัดการแผนที่
let map = null;
let currentZoom = 15; // ค่าเริ่มต้น zoom level

// ฟังก์ชันเพิ่ม/ลด zoom แผนที่
function zoomMap(direction) {
    const iframe = document.querySelector('.map-container iframe');
    if (!iframe) return;

    // สร้าง loading state
    const container = iframe.closest('.map-container');
    const loadingOverlay = container.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }

    // ปรับค่า zoom
    currentZoom = Math.max(1, Math.min(20, currentZoom + direction));
    
    // สร้าง URL ใหม่พร้อม zoom level
    const currentSrc = iframe.src;
    const baseUrl = currentSrc.split('!')[0];
    const newSrc = `${baseUrl}!3m2!1f0!2f0!3m2!1i1024!2i768!4f13.1!5e0!4m2!1sen!2sth!4v1234567890!5m2!1sen!2sth&z=${currentZoom}`;
    
    iframe.src = newSrc;

    // ซ่อน loading state หลังโหลดเสร็จ
    iframe.onload = () => {
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    };
}

// ฟังก์ชันคัดลอกที่อยู่
function copyAddress(type) {
    let address = '';
    
    if (type === 'head-office' || type === 'factory') {
        address = '318 หมู่ 5 ตำบลโคกขาม อำเภอเมืองสมุทรสาคร จังหวัดสมุทรสาคร 74000';
    }

    // คัดลอกไปยัง clipboard
    navigator.clipboard.writeText(address).then(() => {
        // แสดง toast notification
        const toast = document.createElement('div');
        toast.className = 'toast toast-top toast-center';
        toast.innerHTML = `
            <div class="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>คัดลอกที่อยู่เรียบร้อยแล้ว</span>
            </div>
        `;
        document.body.appendChild(toast);

        // ลบ toast หลังจาก 3 วินาที
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }).catch(err => {
        console.error('ไม่สามารถคัดลอกที่อยู่ได้:', err);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeMobileMenu();
    initializeResponsiveImages();
    initializeForm();
    
    // จัดการการ resize ครั้งแรก
    handleResize();
    
    // เพิ่ม listener สำหรับ resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
});

// จัดการการหมุนหน้าจอบนมือถือ
window.addEventListener('orientationchange', () => {
    setTimeout(handleResize, 100);
});