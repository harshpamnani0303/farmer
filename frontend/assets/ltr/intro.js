// introSection.js
export default function createIntroSection() {
    const introData = [
      { icon: 'fas fa-truck', title: 'Free Home Delivery', desc: 'Lorem ipsum dolor sit amet adipisicing elit nobis.' },
      { icon: 'fas fa-sync-alt', title: 'Instant Return Policy', desc: 'Lorem ipsum dolor sit amet adipisicing elit nobis.' },
      { icon: 'fas fa-headset', title: 'Quick Support System', desc: 'Lorem ipsum dolor sit amet adipisicing elit nobis.' },
      { icon: 'fas fa-lock', title: 'Secure Payment Way', desc: 'Lorem ipsum dolor sit amet adipisicing elit nobis.' }
    ];
  
    return `
      <section class="section intro-part">
        <div class="container">
          <div class="row intro-content">
            ${introData.map(item => `
              <div class="col-sm-6 col-lg-3">
                <div class="intro-wrap">
                  <div class="intro-icon">
                    <i class="${item.icon}"></i>
                  </div>
                  <div class="intro-content">
                    <h5>${item.title}</h5>
                    <p>${item.desc}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }
  