import { Prose } from "@/registry/grana/ui/prose";
import { Label, Row, Story } from "@/playground/lib/story";

/* A realistic rendered-markdown sample (what the model writes in a run's notes): headings,
 * paragraphs, lists, inline code, a code block, a blockquote, a table with numbers, a link,
 * a rule. Static HTML — the product renders it from sanitized markdown. */
const SAMPLE = `
<h2>Weekly team update · w34</h2>
<p>Pulled the week's activity from <a href="#prose">Linear</a> and the shared calendar. Three shipped, one slipped, and the <code>sync push</code> path landed its first row in the workspace with <strong>no evidence keys</strong> — the consent ladder holds.</p>
<h3>What shipped</h3>
<ul>
  <li>The hosted plane is live at <code>luminars-cloud.vercel.app</code>, functions in Dublin.</li>
  <li>The console signs you in from the emailed link — the fragment is consumed once and the URL cleaned.</li>
  <li>The form family joined the library: <em>30 components in six groups</em>.</li>
</ul>
<h3>Numbers</h3>
<table>
  <thead><tr><th>Stream</th><th>Planned</th><th>Done</th><th>Δ</th></tr></thead>
  <tbody>
    <tr><td>Hosted plane</td><td>6</td><td>6</td><td>0</td></tr>
    <tr><td>Console</td><td>4</td><td>3</td><td>−1</td></tr>
    <tr><td>Design library</td><td>12</td><td>30</td><td>+18</td></tr>
  </tbody>
</table>
<p>Run this before the review — the gate is the only truth:</p>
<pre><code>scripts/gate.sh
# fmt / clippy -D warnings / nextest, then tsc / eslint / vitest</code></pre>
<blockquote>“The code template stays refused on the Free tier, so the app's code field also accepts the sign-in link pasted whole.” — build notes §4</blockquote>
<ol>
  <li>Confirm the custom SMTP sender with the owner.</li>
  <li>Re-run the awake-display walk on the packaged build.</li>
  <li>Close m26·b once the first sign-in is proven in the owner's Chrome.</li>
</ol>
<hr>
<p>Questions for you: is the Pro tier worth it this month, or do we ride the Free tier until the first partner lands?</p>
`;

const SHORT = `
<p>Landed the row. <code>SYN-2</code> is live; the heartbeat and consent rows followed within the minute.</p>
<ul><li>push → <code>200</code></li><li>no evidence keys</li></ul>
`;

export default function ProseStories() {
  return (
    <div>
      <Story title="md (default)" note="the run report: 13.5px / 1.55 — in a report card, 760px column">
        <div className="max-w-[760px] rounded-md border border-border-strong bg-card px-6 py-[22px] shadow-card">
          <Prose dangerouslySetInnerHTML={{ __html: SAMPLE }} />
        </div>
      </Story>

      <Story title="sm" note="the rail: 13px / 1.5 — in a 340px rail, the reply under an agent turn">
        <div className="w-[340px] rounded-lg border border-border bg-card p-3.5 shadow-panel">
          <div className="flex flex-col gap-3.5">
            <div className="max-w-[85%] self-end rounded-md bg-canvas-deep px-3 py-2 text-13">
              What did we ship this week?
            </div>
            <Prose size="sm" dangerouslySetInnerHTML={{ __html: SAMPLE }} />
          </div>
        </div>
      </Story>

      <Story title="lg" note="the console's reading column: serif 15px / 1.6, 66ch — a process goal">
        <Prose size="lg" dangerouslySetInnerHTML={{ __html: SAMPLE }} />
      </Story>

      <Story title="Flush edges" note="first and last child drop their outer margin — the block sits level in a bubble or a card">
        <Row>
          <div className="w-[320px] rounded-sm border border-border bg-surface-2 px-2.5 py-2">
            <Prose size="sm" dangerouslySetInnerHTML={{ __html: SHORT }} />
          </div>
          <Label>in an edit card</Label>
        </Row>
      </Story>

      <Story title="Rendered as an article" note="useRender — the same skin on a semantic element">
        <Prose
          size="sm"
          className="max-w-[520px]"
          render={<article aria-label="Nota" />}
          dangerouslySetInnerHTML={{ __html: SHORT }}
        />
      </Story>

      <Story title="Long words and Italian-length lines" note="overflow-wrap: anywhere — an unbroken token never widens the rail">
        <div className="w-[340px] rounded-lg border border-border bg-card p-3.5">
          <Prose
            size="sm"
            dangerouslySetInnerHTML={{
              __html:
                "<p>Sincronizzazione completata per <code>workspace_0d42192_luminars_cloud_production_eu_west_1_dublin</code> — la riga è atterrata senza chiavi di evidenza, come previsto dal contratto di consenso.</p><p>https://luminars-cloud.vercel.app/console/#/workspaces/0d42192/processes/weekly-team-update/runs/2026-08-23T10-08</p>",
            }}
          />
        </div>
      </Story>
    </div>
  );
}
