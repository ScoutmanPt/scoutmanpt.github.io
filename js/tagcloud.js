(function () {
  var resultsEl = document.getElementById('tagcloud-results');
  var postsDataEl = document.getElementById('tagcloud-posts');
  var labelsDataEl = document.getElementById('tagcloud-labels');
  var tagButtons = document.querySelectorAll('.tag-cloud-tag');
  if (!resultsEl || !postsDataEl || !tagButtons.length) return;

  var postsByTag = JSON.parse(postsDataEl.textContent || '{}');
  var tagLabels = JSON.parse((labelsDataEl && labelsDataEl.textContent) || '{}');
  var PAGE_SIZE = 5;
  var state = { posts: [], page: 0, tagName: '' };

  function renderPage() {
    var start = state.page * PAGE_SIZE;
    var pagePosts = state.posts.slice(start, start + PAGE_SIZE);

    resultsEl.innerHTML = '';

    var title = document.createElement('h4');
    title.className = 'tagcloud-results-title';
    title.textContent = state.tagName;
    resultsEl.appendChild(title);

    var list = document.createElement('ul');
    list.className = 'tagcloud-results-list';
    pagePosts.forEach(function (p) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      var date = document.createElement('span');

      link.href = p.url;
      link.textContent = p.title;
      date.className = 'tagcloud-results-date';
      date.textContent = p.date;

      item.appendChild(link);
      item.appendChild(date);
      list.appendChild(item);
    });
    resultsEl.appendChild(list);

    var totalPages = Math.ceil(state.posts.length / PAGE_SIZE);
    if (totalPages > 1) {
      var pager = document.createElement('div');
      var prevBtn = document.createElement('button');
      var status = document.createElement('span');
      var nextBtn = document.createElement('button');

      pager.className = 'tagcloud-pager';
      prevBtn.type = 'button';
      prevBtn.className = 'tagcloud-pager-prev';
      prevBtn.disabled = state.page === 0;
      prevBtn.textContent = 'Prev';
      status.className = 'tagcloud-pager-status';
      status.textContent = (state.page + 1) + ' / ' + totalPages;
      nextBtn.type = 'button';
      nextBtn.className = 'tagcloud-pager-next';
      nextBtn.disabled = state.page >= totalPages - 1;
      nextBtn.textContent = 'Next';

      prevBtn.addEventListener('click', function () { state.page--; renderPage(); });
      nextBtn.addEventListener('click', function () { state.page++; renderPage(); });

      pager.appendChild(prevBtn);
      pager.appendChild(status);
      pager.appendChild(nextBtn);
      resultsEl.appendChild(pager);
    }
  }

  function setActiveTag(name) {
    tagButtons.forEach(function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-tag') === name);
    });
  }

  function selectTag(name) {
    var key = (name || '').toLowerCase();
    state.posts = postsByTag[key] || [];
    state.page = 0;
    state.tagName = tagLabels[key] || name;
    setActiveTag(key);
    renderPage();
    try { history.replaceState(null, '', '#' + encodeURIComponent(key)); } catch (e) {}
  }

  tagButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      selectTag(button.getAttribute('data-tag'));
    });
  });

  var hash = decodeURIComponent(window.location.hash.replace('#', '')).toLowerCase();
  if (hash && postsByTag[hash]) {
    selectTag(hash);
  }
})();
