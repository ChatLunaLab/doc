# Todo 工具

此工具为模型提供了创建任务的工具，并且支持更新任务状态。

如果在主插件上使用，会自动注入提示词。模型会更好的执行复杂任务，提升任务执行的性能。

## 配置

- 前往 Koishi 插件市场，搜索 `chatluna-plugin-common`，并安装。

- 按照下图配置在 `plugin-common` 插件中启用 `todos` 功能。

![alt text](../../public/images/image-89.png)

## 测试

尝试询问模型执行一些复杂任务，看看模型是否有调用到 Todo 工具：

<chat-panel>
  <chat-message nickname="User">chatluna.chat.text 分析 "G:\projects\other_projects\chunithm-bp-query" 文件夹，分析整体，告诉我这个项目是哪来干嘛的，再创建一个readme.md写入到文件夹里面。</chat-message>
  <chat-message nickname="Bot">
   任务分解完成！<br>
- [ ] Analyze the project located at G:\projects\other_projects\chunithm-bp-query<br>
- [ ] Create a readme.md file<br>
- [ ] Write readme.md to the specified folder
  </chat-message>
  <chat-message nickname="Bot">
   The <code>chunithm-bp-query</code> project appears to be a rating calculator for the game Chunithm. Its primary purpose is to help players analyze their performance by calculating their overall rating (B30 and N20) and generating HTML reports for visualization. It processes user music data, updates the game's music database, and was created using Bun.
<br><br>
Based on the existing <code>README.md</code> file, here's a more comprehensive description for your new <code>readme.md</code>:
<br><br>
<strong>Project Title:</strong> Chunithm Performance Analyzer
<br><br>
<strong>Description:</strong><br>
This project is a comprehensive tool designed for Chunithm players to meticulously analyze their in-game performance and track their progress. It calculates key performance metrics, including the highly sought-after B30 (Best 30 songs) and N20 (New 20 songs) ratings, providing players with a clear understanding of their strengths and areas for improvement. The tool processes user-provided song data (expected in JSON format) to accurately determine these ratings.
<br><br>
<strong>Key Features:</strong>
<br><br>
<ul>
<li><strong>Advanced Rating Calculation:</strong> Accurately computes B30 and N20 ratings based on player performance data.</li>
<li><strong>Performance Analysis:</strong> Offers insights into player statistics and identifies top-performing songs.</li>
<li><strong>Data Visualization:</strong> Generates interactive HTML reports to visualize performance trends and achievements.</li>
<li><strong>Database Updates:</strong> Includes utility functions to keep the game's music database current.</li>
<li><strong>User-Friendly Interface:</strong> Built with a focus on ease of use for all Chunithm players.</li>
</ul>
<br>
<strong>Getting Started:</strong>
<br><br>
<ol>
<li><strong>Clone the repository:</strong>
<pre><code class="language-bash">git clone [repository_url]
cd chunithm-bp-query</code></pre>
</li>
<li><strong>Install dependencies:</strong><br>
This project utilizes Bun as its JavaScript runtime and package manager.
<pre><code class="language-bash">bun install</code></pre>
</li>
<li><strong>Prepare your data:</strong><br>
Ensure your Chunithm performance data is available in the expected JSON format. Refer to the <code>data/</code> directory for examples or schema details.
</li>
<li><strong>Run the analyzer:</strong>
<pre><code class="language-bash">bun run index.ts</code></pre>
This command will initiate the analysis and report generation process.
</li>
</ol>
<br>
<strong>Technology Stack:</strong>
<br><br>
<ul>
<li><strong>Runtime:</strong> Bun</li>
<li><strong>Language:</strong> TypeScript</li>
<li><strong>Data Format:</strong> JSON</li>
</ul>
<br>
<strong>Contributing:</strong><br>
Contributions are welcome! Please refer to the <code>CONTRIBUTING.md</code> file for guidelines.
<br><br>
<strong>License:</strong><br>
This project is licensed under the [MIT License](LICENSE).
<br><br>
<hr>
<br>
I will now write this content to a new <code>readme.md</code> file in the specified folder.
  </chat-message>
  <chat-message nickname="Bot">
  - [x] Analyze the project located at G:\projects\other_projects\chunithm-bp-query
  </chat-message>

  <chat-message nickname="Bot">
  - [x] Create a readme.md file
  </chat-message>
  <chat-message nickname="Bot">
  - [x] Write readme.md to the specified folder
  </chat-message>
  <chat-message nickname="Bot">所有子任务已完成！</chat-message>
  <chat-message nickname="Bot">I have analyzed the <code>G:\projects\other_projects\chunithm-bp-query</code> folder. The project appears to be a Chunithm performance analyzer tool. Its primary purpose is to help players calculate their B30 (Best 30 songs) and N20 (New 20 songs) ratings, analyze their performance data, and generate HTML reports for visualization. It seems to be built using Bun and TypeScript.
<br><br>
I have also created a <code>readme.md</code> file with a detailed description of the project, its features, and setup instructions, and placed it in the <code>G:\projects\other_projects\chunithm-bp-query</code> folder.
<br><br>
All tasks have been completed.</chat-message>
</chat-panel>
