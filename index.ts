import { Context, SettingModel } from 'hydrooj';

export async function apply(ctx: Context) {
	ctx.injectUI('Nav', 'docs_homepage', {url: '/homepage', before: 'problem'});

	ctx.effect(() => {
		const setting = SettingModel.SETTINGS_BY_KEY.qq;
		if (!setting) return () => {};

		const accountIndex = SettingModel.ACCOUNT_SETTINGS.indexOf(setting);
		const settingsIndex = SettingModel.SETTINGS.indexOf(setting);

		if (accountIndex >= 0) SettingModel.ACCOUNT_SETTINGS.splice(accountIndex, 1);
		if (settingsIndex >= 0) SettingModel.SETTINGS.splice(settingsIndex, 1);
		delete SettingModel.SETTINGS_BY_KEY.qq;

		return () => {
			if (!SettingModel.SETTINGS_BY_KEY.qq) SettingModel.SETTINGS_BY_KEY.qq = setting;
			if (!SettingModel.ACCOUNT_SETTINGS.includes(setting)) {
				const restoreAccountIndex = accountIndex >= 0 ? Math.min(accountIndex, SettingModel.ACCOUNT_SETTINGS.length) : SettingModel.ACCOUNT_SETTINGS.length;
				SettingModel.ACCOUNT_SETTINGS.splice(restoreAccountIndex, 0, setting);
			}
			if (!SettingModel.SETTINGS.includes(setting)) {
				const restoreSettingsIndex = settingsIndex >= 0 ? Math.min(settingsIndex, SettingModel.SETTINGS.length) : SettingModel.SETTINGS.length;
				SettingModel.SETTINGS.splice(restoreSettingsIndex, 0, setting);
			}
		};
	});
}