import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const themePath = path.join(process.cwd(), 'public', 'assets', 'theme.json');

    let theme: Record<string, unknown> = {};

    if (fs.existsSync(themePath)) {
      const themeContent = fs.readFileSync(themePath, 'utf8');
      theme = JSON.parse(themeContent) as Record<string, unknown>;
    }

    const overrides: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(process.env)) {
      if (!key.startsWith('THEME_')) continue;

      const themeKey = key.slice(6);

      try {
        overrides[themeKey] = JSON.parse(value as string);
      } catch {
        overrides[themeKey] = value;
      }
    }

    const merged = {
      ...theme,
      ...overrides,
      _buildTime: process.env.BUILD_TIME || 'unknown',
      _overrides: Object.keys(overrides),
    };

    return NextResponse.json(merged);
  } catch (error) {
    console.error('Theme API error:', error);
    return NextResponse.json(
      { tenantId: 'dguv' },
      { status: 200 }
    );
  }
}
