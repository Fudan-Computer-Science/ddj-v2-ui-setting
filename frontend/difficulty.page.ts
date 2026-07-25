import { $, NamedPage, addPage } from '@hydrooj/ui-default';

// 1 ~ 10 級台灣競程風格難度對照表
const DIFFICULTY_MAP = {
    1: { text: '語法新手', color: 'rgb(254, 76, 97)' },      // 洛谷紅
    2: { text: '觀念3級', color: 'rgb(243, 156, 17)' }, // 洛谷橙
    3: { text: '實作3級', color: 'rgb(255, 193, 22)' },     // 洛谷黃
    4: { text: '實作4級', color: 'rgb(82, 196, 26)' },      // 洛谷綠
    5: { text: '實作5級', color: 'rgb(52, 152, 219)' },      // 洛谷藍
    6: { text: '能競區賽', color: 'rgb(157, 61, 207)' },     // 洛谷紫
    7: { text: '能競全國賽', color: 'rgb(14, 29, 105)' },      // 洛谷黑/深藍
    8: { text: 'TOI 破台', color: 'rgb(100, 20, 140)' },     // 深紫
    9: { text: 'TOI 國手', color: 'rgb(30, 30, 30)' },       // 酷黑
    10: { text: '高科技', color: 'rgb(218, 165, 32)' }     // 璀璨金
};

const DEFAULT_DIFFICULTY = { text: '暫無評定', color: 'rgb(191, 191, 191)' };
const ALL_TEXTS = Object.values(DIFFICULTY_MAP).map(item => item.text).concat([DEFAULT_DIFFICULTY.text]);

// 格式化 HTML 標籤
function getDifficultySpan(levelNum) {
    const info = DIFFICULTY_MAP[levelNum] || DEFAULT_DIFFICULTY;
    return `<span style="color: ${info.color}; font-weight: bold;">${info.text}</span>`;
}

// 1. 題目列表 & 訓練列表 難度替換
addPage(new NamedPage(['problem_main', 'training_detail'], async () => {
    function renderListDifficulty() {
        $("head").append("<style>.col--difficulty { width: 7.5rem!important; }</style>");
        
        $(".col--difficulty").each((_, el) => {
            if (el.tagName.toLowerCase() === "th") return;
            
            const rawText = $(el).text().trim();
            if (ALL_TEXTS.includes(rawText)) return; // 已替換過則跳過

            if (rawText === "(无)" || rawText === "0") {
                $(el).html(getDifficultySpan(0));
            } else {
                const level = parseInt(rawText, 10);
                $(el).html(getDifficultySpan(level));
            }
        });
    }

    await renderListDifficulty();
    $(document).on('vjContentNew', renderListDifficulty);
}));

// 2. 題目內頁 難度標籤替換
addPage(new NamedPage(['problem_detail'], async () => {
    function renderDetailDifficulty() {
        $(".problem__tag-item").each((_, el) => {
            const rawText = $(el).text().trim();
            if (ALL_TEXTS.includes(rawText)) return;

            if (rawText.startsWith("難度: ")) {
                const level = parseInt(rawText.split(":")[1].trim(), 10);
                $(el).html(getDifficultySpan(level));
            } else if (rawText === "(無)") {
                $(el).html(getDifficultySpan(0));
            }
        });
    }

    await renderDetailDifficulty();
    $(document).on('vjContentNew', renderDetailDifficulty);
}));

// 3. 題目編輯 & 建立頁面 下拉選單替換
addPage(new NamedPage(['problem_edit', 'problem_create'], async () => {
    function renderSelect() {
        const $container = $('div[name="form_item_difficulty"]');
        if (!$container.length || $container.find('select[name="difficulty"]').length) return;

        const $input = $container.find('input[name="difficulty"]');
        const currentValue = $input.val();

        const $select = $('<select name="difficulty" class="select"></select>');

        // 填充 1~10 選項
        Object.keys(DIFFICULTY_MAP).forEach(key => {
            const level = +key;
            const item = DIFFICULTY_MAP[level];
            const $opt = $('<option></option>')
                .val(level)
                .text(`${level}. ${item.text}`)
                .css({ color: item.color, 'font-weight': 'bold' });
            $select.append($opt);
        });

        // 預設/未評定選項
        $select.append(
            $('<option></option>')
                .val(0)
                .text(DEFAULT_DIFFICULTY.text)
                .css({ color: DEFAULT_DIFFICULTY.color, 'font-weight': 'bold' })
        );

        if (currentValue) $select.val(currentValue);

        const updateColor = () => {
            const val = +$select.val();
            const item = DIFFICULTY_MAP[val] || DEFAULT_DIFFICULTY;
            $select.css({ color: item.color, 'font-weight': 'bold' });
        };

        $select.on('change', updateColor);
        $input.replaceWith($select);
        $container.addClass('select-container');
        updateColor();
    }

    await renderSelect();
    $(document).on("vjContentNew", renderSelect);
}));
