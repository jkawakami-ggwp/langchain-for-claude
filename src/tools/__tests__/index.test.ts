import { tools } from '../index';
import { getWeatherTool } from '../getWeatherTool';
import { getCurrentDateTimeTool } from '../getCurrentDateTimeTool';

describe('tools', () => {
  it('ツールの配列をエクスポートすること', () => {
    expect(Array.isArray(tools)).toBe(true);
  });

  it('getWeatherToolを含むこと', () => {
    expect(tools).toContain(getWeatherTool);
  });

  it('getCurrentDateTimeToolを含むこと', () => {
    expect(tools).toContain(getCurrentDateTimeTool);
  });

  it('正確に2つのツールをエクスポートすること', () => {
    expect(tools).toHaveLength(2);
  });

  it('すべてのツールが必要なプロパティを持つこと', () => {
    tools.forEach((tool) => {
      expect(tool).toHaveProperty('name');
      expect(tool).toHaveProperty('description');
      expect(tool).toHaveProperty('schema');
      expect(typeof tool.name).toBe('string');
      expect(typeof tool.description).toBe('string');
    });
  });

  it('すべてのツール名がユニークであること', () => {
    const toolNames = tools.map((tool) => tool.name);
    const uniqueNames = new Set(toolNames);
    expect(uniqueNames.size).toBe(toolNames.length);
  });

  it('すべてのツールがinvokeメソッドで呼び出し可能であること', () => {
    tools.forEach((tool) => {
      expect(tool).toHaveProperty('invoke');
      expect(typeof tool.invoke).toBe('function');
    });
  });
});
