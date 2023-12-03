// components/Settings.js
export default function Settings({ openAIKey, setOpenAIKey, screenshotOneAPIKey, setScreenshotOneAPIKey }) {
    return (
      <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
        <input type="checkbox" />
        <div className="collapse-title text-xl font-medium">
          Settings
        </div>
        <div className="collapse-content">
          <label className="label cursor-pointer justify-start gap-2">
            <span className="label-text text-white">DALL-E Placeholder Image Generation</span>
            <input type="checkbox" className="toggle toggle-primary" />
          </label>
          <label className="label cursor-pointer justify-start gap-2">
            <span className="label-text text-white">OpenAI API key</span>
            <input type="text" placeholder="OpenAI API key" className="input input-bordered w-full max-w-xs" value={openAIKey} onChange={(e) => setOpenAIKey(e.target.value)} />
          </label>
          <label className="label cursor-pointer justify-start gap-2">
            <span className="label-text text-white">Screenshot by URL Config</span>
            <input type="text" placeholder="ScreenshotOne API key" className="input input-bordered w-full max-w-xs" value={screenshotOneAPIKey} onChange={(e) => setScreenshotOneAPIKey(e.target.value)} />
          </label>
        </div>
      </div>
    );
  }