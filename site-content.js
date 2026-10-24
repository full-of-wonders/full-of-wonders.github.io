(async () => {
  'use strict';

  try {
    const response = await fetch('/content.json', {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('無法讀取 content.json');
    }

    const data = await response.json();
    const $ = id => document.getElementById(id);

    // 更新文字
    function setText(id, value) {
      const element = $(id);
      if (element && typeof value === 'string' && value.trim()) {
        element.textContent = value;
      }
    }

    // 公司名稱
    if (data.companyName) {
      document.querySelectorAll('[data-company-name]').forEach(el => {
        el.textContent = data.companyName;
      });
    }

    // 公司 LOGO
    if (data.logo && $('site-logo')) {
      const logo = $('site-logo');
      logo.src = data.logo;
      logo.hidden = false;
    }

    // 首頁標題
    if (data.headline && $('headline')) {
      const headline = $('headline');
      const lines = data.headline.split('\n');

      headline.replaceChildren();

      lines.forEach((line, index) => {
        if (index > 0) {
          headline.appendChild(document.createElement('br'));
        }
        headline.appendChild(document.createTextNode(line));
      });
    }

    // 首頁介紹
    setText('tagline', data.tagline);

    // 公司介紹
    setText('about-text', data.about);

    // 聯絡說明
    setText('contact-text', data.contactText);

    // 電話
    if (data.phone && $('phone-link')) {
      const phone = $('phone-link');
      phone.href = 'tel:' + data.phone.replace(/[^0-9+]/g, '');
      phone.textContent = '撥打電話：' + data.phone;
    }

    // LINE
    if (data.line) {
      const lineURL =
        'https://line.me/ti/p/~' + encodeURIComponent(data.line);

      if ($('line-link')) {
        $('line-link').href = lineURL;
        $('line-link').textContent = 'LINE 洽詢：' + data.line + ' ↗';
      }

      if ($('float-line')) {
        $('float-line').href = lineURL;
      }
    }

    // 首頁形象圖片
    if (data.heroImage && $('hero-art')) {
      const hero = $('hero-art');
      hero.style.backgroundImage =
        'url(' + JSON.stringify(data.heroImage) + ')';
      hero.classList.add('has-image');

      if ($('art-label')) {
        $('art-label').hidden = true;
      }
    }

    // 設計理念圖片
    if (data.materialImage && $('material-image')) {
      const material = $('material-image');
      material.style.backgroundImage =
        'url(' + JSON.stringify(data.materialImage) + ')';
      material.classList.add('has-image');

      if ($('placeholder-notice')) {
        $('placeholder-notice').hidden = true;
      }
    }

    // 工程實績
    const grid = $('projects-grid');

    if (grid && Array.isArray(data.projects)) {
      grid.replaceChildren();

      data.projects.forEach(project => {
        const article = document.createElement('article');
        article.className = 'card project-card';

        if (project.image) {
          const img = document.createElement('img');
          img.src = project.image;
          img.alt = project.title || '工程作品';
          img.className = 'project-image';
          img.loading = 'lazy';
          article.appendChild(img);
        }

        if (project.category) {
          const category = document.createElement('div');
          category.className = 'category';
          category.textContent = project.category;
          article.appendChild(category);
        }

        if (project.title) {
          const title = document.createElement('h3');
          title.textContent = project.title;
          article.appendChild(title);
        }

        if (project.description) {
          const description = document.createElement('p');
          description.textContent = project.description;
          article.appendChild(description);
        }

        grid.appendChild(article);
      });

      if (data.projects.length > 0) {
        if ($('projects')) $('projects').hidden = false;
        if ($('projects-nav')) $('projects-nav').hidden = false;
      } else {
        if ($('projects')) $('projects').hidden = true;
        if ($('projects-nav')) $('projects-nav').hidden = true;
      }
    }

    console.log('福王網站資料同步成功');

  } catch (error) {
    console.warn('福王網站資料同步失敗：', error);
  }
})();
