(function () {
    function getAncestors(node) {
        var ancestors = [];
        var current = node.parentElement;
        while (current) {
            ancestors.push(current);
            current = current.parentElement;
        }
        return ancestors;
    }
    function lastSameAncestor(nodeA, nodeB) {
        var ancestorsA = getAncestors(nodeA);
        var ancestorsB = getAncestors(nodeB);
        if (ancestorsA.length > ancestorsB.length) {
            var temp = ancestorsA;
            ancestorsA = ancestorsB;
            ancestorsB = temp;
        }
        for (var i = 0; i < ancestorsA.length; ++i) {
            var ancestorA = ancestorsA[i];
            for (var j = 0; j < ancestorsB.length; ++j) {
                var ancestorB = ancestorsB[j];
                if (ancestorA === ancestorB)
                    return ancestorA;
            }
        }
        return null;
    }
    function sel2qry(sel) {
        var qry = '';
        var current = sel.anchorNode;
        var parent = current.parentElement;
        var textNode = false;
        var textNodeIndex = 0;
        var tracePath = [];
        var anchorElement = (sel.anchorNode.nodeType === 3) ? sel.anchorNode.parentElement : sel.anchorNode;
        var focusElement = (sel.focusNode.nodeType === 3) ? sel.focusNode.parentElement : sel.focusNode;
        if (anchorElement !== focusElement) {
            current = lastSameAncestor(anchorElement, focusElement);
        } else if (current.nodeType === 3) {
            if (parent.childNodes.length > 1) {
                textNode = true;
                textNodeIndex = Array.prototype.indexOf.call(parent.childNodes, current);
            }
            current = parent;
        }
        function trace() {
            tracePath.push({
                cls: current.classList || [],
                tag: current.tagName.toLowerCase(),
                idx: Array.prototype.indexOf.call(parent.childNodes, current),
                id: current.id
            });
            qry = tracePath.concat().reverse().map(function (node) {
                if (node.id) return '#' + node.id;
                if (node.cls.length) return Array.prototype.map.call(node.cls, function (cls) {return '.' + cls}).join('');
                return node.tag;
            }).join(' ');
        }
        while (true) {
            parent = current.parentElement;
            if (current.id) {
                trace();
                break;
            } else if (current.classList.length) {
                trace();
            } else if (parent.getElementsByTagName(current.tagName).length === 1) {
                trace();
            }
            if (qry && document.querySelectorAll(qry).length === 1) break;
            current = parent;
            if (!parent) throw new Error('failed');
        }
        return 'document.querySelector(\'' + qry + '\')' + (textNode ? '.childNodes[' + textNodeIndex + ']' : '');
    }
    function once(target, event, handler) {
        function proxyHandler(e) {
            target.removeEventListener(event, proxyHandler);
            handler.call(target, e);
        }
        target.addEventListener(event, proxyHandler)
    }
    // 생성 시작
    var name = '';
    var parser = {};
    function dragGen(message, prop) {
        if (Array.isArray(message)) {
            message = message.join('\n');
        }
        return new Promise(function (resolve, reject) {
            window.alert(message);
            once(window, 'mouseup', function () {
                var sel = document.getSelection();
                var qry;
                try {
                    qry = sel2qry(sel);
                } catch (e) {
                    reject(e);
                }
                parser[prop] = qry;
                sel.empty();
                resolve();
            });
        });
    }
    new Promise(function (resolve, reject) {
        window.alert([
            'jews 파서 초벌생성을 시작하겠습니다.',
            '생성된 코드는 적당히 수정해서',
            'jews 프로젝트(https://github.com/disjukr/jews)에',
            'Pull Request 해주시면 감사하겠습니다.'
        ].join('\n'));
        name = window.prompt('뉴스 사이트 이름을 입력해주세요.');
        resolve();
    }).then(
        dragGen.bind(null, '뉴스 제목을 드래그해서 선택해주세요.', 'title')
    ).then(
        dragGen.bind(null, '부제목을 드래그해서 선택해주세요.', 'subtitle')
    ).then(
        dragGen.bind(null, '본문영역을 드래그해서 선택해주세요.', 'content')
    ).then(function () {
        console.info([
            '%cjews에 기여하기:',
            '%c1. 상단의 UserScript 주석에 뉴스 페이지 주소 패턴을 추가합니다.',
            '%c// @include ' + window.location.href + '%c',
            '',
            '%c2. `where` 함수에 뉴스사를 구분할 수 있는 문자열을 추가합니다.',
            '%ccase \'' + window.location.hostname + '\': return \'' + name + '\';%c',
            '',
            '%c3. `jews.title`, `jews.subtitle`, `jews.content`, `jews.timestamp`, `jews.reporters`를 각각 구현합니다.',
            '%cparse[\'' + name + '\'] = function (jews) {',
            '    jews.title = ' + parser['title'] + '.textContent.trim();',
            '    jews.subtitle = ' + parser['subtitle'] + '.textContent.trim();',
            '    jews.content = (function () {',
            '        var content = clearStyles(' + parser['content'] + '.cloneNode(true)).innerHTML;',
            '        // 본문영역 광고 제거는 여기서',
            '    })();',
            '    // jews.timestamp',
            '    // jews.reporters',
            '};%c',
            '',
            '%c4. 코드를 다듬고 Pull Request를 보내면 끝!'
        ].join('\n'),
            'font-weight: bold; font-size: 30px;',
            'font-weight: bold; font-size: 16px;',
            'font-size: 10px; padding: 2px; line-height: 16px; background-color: #e8e8e8; border: 1px solid #ddd; border-radius: 2px;',
            '',
            'font-weight: bold; font-size: 16px;',
            'font-size: 10px; padding: 2px; line-height: 16px; background-color: #e8e8e8; border: 1px solid #ddd; border-radius: 2px;',
            '',
            'font-weight: bold; font-size: 16px;',
            'font-size: 10px; padding: 2px; line-height: 16px; background-color: #e8e8e8; border: 1px solid #ddd; border-radius: 2px;',
            '',
            'font-weight: bold; font-size: 16px;'
        );
        window.alert([
            'jews 파서 초벌생성이 완료되었습니다.',
            '브라우저 콘솔 창을 확인해주세요.'
        ]);
    }).catch(function (e) {
        window.alert([
            '파서 초벌 생성에 실패했어요...',
            '에러는 브라우저 콘솔창을 확인해주세요.'
        ]);
        console.error(e.message);
        console.log(e.stack);
    });
})();
