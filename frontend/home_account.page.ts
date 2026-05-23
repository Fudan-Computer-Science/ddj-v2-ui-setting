import { addPage } from '@hydrooj/ui-default';

addPage(new (window.Hydro as any).NamedPage('home_account', () => {
    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement | null;
        const button = target?.closest('button.change-avatar');
        if (!button) return;

        window.setTimeout(() => {
            const select = document.getElementById('type') as HTMLSelectElement | null;
            if (!select) return;

            const qqOption = Array.from(select.options).find((option) => option.value === 'qq');
            if (!qqOption) return;

            const shouldFallback = select.value === 'qq';
            qqOption.remove();

            if (shouldFallback) {
                select.value = 'gravatar';
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, 0);
    });
}));