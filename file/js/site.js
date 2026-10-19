(function () {
    'use strict';
    var turkish = document.documentElement.lang === 'tr';

    function loadJson(path) {
        return fetch(path, {cache: 'no-store'}).then(function (response) {
            if (!response.ok) throw new Error('Could not load ' + path);
            return response.json();
        });
    }

    loadJson('data/names.json').then(function (people) {
        var fragment = document.createDocumentFragment();
        people.forEach(function (person) {
            var url;
            try { url = new URL(person.url); } catch (_) { return; }
            if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
            var link = document.createElement('a');
            link.className = 'member';
            link.href = url.href;
            var top = document.createElement('div');
            top.className = 'member-top';
            var arrow = document.createElement('span');
            arrow.className = 'member-arrow';
            arrow.setAttribute('aria-hidden', 'true');
            arrow.textContent = '↗';
            top.appendChild(arrow);
            var name = document.createElement('h3');
            name.textContent = person.name;
            if (Number.isInteger(person.birthYear)) {
                var year = document.createElement('span');
                year.className = 'member-age';
                year.textContent = person.birthYear;
                year.setAttribute('aria-label', turkish ? 'Doğum yılı ' + person.birthYear : 'Born in ' + person.birthYear);
                name.append(' ', year);
            }
            var domain = document.createElement('span');
            domain.className = 'member-domain';
            domain.textContent = url.hostname;
            link.append(top, name, domain);
            fragment.appendChild(link);
        });
        document.getElementById('members').replaceChildren(fragment);
    }).catch(function () {
        document.getElementById('members').textContent = turkish
            ? 'Aile rehberi şu anda yüklenemiyor. Lütfen tekrar deneyin.'
            : 'The family directory is unavailable right now. Please try again later.';
    });

    loadJson('data/stats.json').then(function (stats) {
        document.getElementById('people-count').textContent = stats.peopleCount;
        document.getElementById('surname-rank').textContent = stats.surnameRank;
        document.getElementById('country').textContent = turkish ? stats.countryTr : stats.countryEn;
    }).catch(function () {
        document.querySelector('.facts-caption p').textContent = turkish
            ? 'Soyadı bilgileri şu anda yüklenemiyor.'
            : 'Surname figures are currently unavailable.';
    });
}());
