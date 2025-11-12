import type { CpuInfo } from 'node:os'

import { afterEach, describe, expect, it, vi } from 'vitest'
import os from 'node:os'

import { collectSystemInfo } from '../../reporters/collect-system-info'

describe('collectSystemInfo', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return system information with correct types', async () => {
    let info = await collectSystemInfo()

    expect(info).toHaveProperty('totalMemoryGb')
    expect(info.totalMemoryGb).toBeGreaterThan(0)
    expect(typeof info.totalMemoryGb).toBe('number')

    expect(info).toHaveProperty('eslintVersion')
    expect(typeof info.eslintVersion).toBe('string')

    expect(info).toHaveProperty('nodeVersion')
    expect(typeof info.nodeVersion).toBe('string')

    expect(info).toHaveProperty('cpuSpeedMHz')
    expect(info.cpuSpeedMHz).toBeGreaterThanOrEqual(0)
    expect(typeof info.cpuSpeedMHz).toBe('number')

    expect(info).toHaveProperty('osRelease')
    expect(typeof info.osRelease).toBe('string')

    expect(info).toHaveProperty('v8Version')
    expect(typeof info.v8Version).toBe('string')

    expect(info).toHaveProperty('platform')
    expect(typeof info.platform).toBe('string')

    expect(info).toHaveProperty('cpuCount')
    expect(info.cpuCount).toBeGreaterThanOrEqual(0)
    expect(typeof info.cpuCount).toBe('number')

    expect(info).toHaveProperty('cpuModel')
    expect(typeof info.cpuModel).toBe('string')

    expect(info).toHaveProperty('arch')
    expect(typeof info.arch).toBe('string')
  })

  it('should fall back to default CPU data when os.cpus returns empty array', async () => {
    vi.spyOn(os, 'cpus').mockReturnValue([] as CpuInfo[])

    let info = await collectSystemInfo()

    expect(info.cpuSpeedMHz).toBe(0)
    expect(info.cpuModel).toBe('unknown')
  })

  it('should report actual CPU model and speed when available', async () => {
    vi.spyOn(os, 'cpus').mockReturnValue([
      { model: 'Test CPU', speed: 3200 } as CpuInfo,
    ])

    let info = await collectSystemInfo()

    expect(info.cpuSpeedMHz).toBe(3200)
    expect(info.cpuModel).toBe('Test CPU')
  })
})
