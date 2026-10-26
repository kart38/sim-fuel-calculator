import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ChevronDown, Fuel, Gauge, Plus, RotateCcw, Trash2 } from 'lucide-react'
import './styles.css'

const LITERS_PER_GALLON = 3.78541
const KG_PER_LITER = 0.75
const LB_PER_KG = 2.20462

type Unit = 'liters' | 'gallons'
type Method = 'time' | 'laps'
type FuelScenario = { id: number; label: string; liters: string }

const DEFAULT_SCENARIOS: FuelScenario[] = [
  { id: 1, label: 'Max usage', liters: '2.345' },
  { id: 2, label: 'Fuel saving', liters: '2.250' },
]

function parseValue(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function pad(value: number) {
  return value.toString().padStart(2, '0')
}

function App() {
  const [method, setMethod] = useState<Method>('time')
  const [unit, setUnit] = useState<Unit>('liters')
  const [lapMinutes, setLapMinutes] = useState('1')
  const [lapSeconds, setLapSeconds] = useState('30')
  const [raceMinutes, setRaceMinutes] = useState('45')
  const [raceLaps, setRaceLaps] = useState('30')
  const [reserveLaps, setReserveLaps] = useState('2')
  const [scenarios, setScenarios] = useState(DEFAULT_SCENARIOS)

  const lapTimeSeconds = parseValue(lapMinutes) * 60 + parseValue(lapSeconds)
  const raceTimeSeconds = parseValue(raceMinutes) * 60
  const lapsByTime = lapTimeSeconds > 0 ? raceTimeSeconds / lapTimeSeconds : 0
  const raceLapsRequired = method === 'time' ? lapsByTime : parseValue(raceLaps)
  const lapsRequired = raceLapsRequired + parseValue(reserveLaps)
  const scenarioLoads = scenarios.map((scenario) => ({
    ...scenario,
    requiredLiters: lapsRequired * parseValue(scenario.liters),
  }))
  const highestLoad = Math.max(...scenarioLoads.map((scenario) => scenario.requiredLiters), 0)
  const requiredDisplay = unit === 'liters' ? highestLoad : highestLoad / LITERS_PER_GALLON

  const reset = () => {
    setLapMinutes('1')
    setLapSeconds('30')
    setRaceMinutes('45')
    setRaceLaps('30')
    setReserveLaps('2')
    setScenarios(DEFAULT_SCENARIOS)
  }

  const updateScenario = (id: number, field: 'label' | 'liters', value: string) => {
    setScenarios((current) => current.map((scenario) => {
      if (scenario.id !== id) return scenario
      return field === 'liters'
        ? { ...scenario, liters: unit === 'liters' ? value : (parseValue(value) * LITERS_PER_GALLON).toString() }
        : { ...scenario, [field]: value }
    }))
  }

  const scenarioDisplayValue = (liters: string) => unit === 'liters'
    ? liters
    : (parseValue(liters) / LITERS_PER_GALLON).toFixed(3)

  const addScenario = () => {
    setScenarios((current) => [
      ...current,
      { id: Date.now(), label: `Scenario ${current.length + 1}`, liters: current.at(-1)?.liters ?? '2.345' },
    ])
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><Gauge size={22} strokeWidth={2.4} /> Fuelwise</div>
        <div className="unit-switch" aria-label="Fuel unit">
          <button className={unit === 'liters' ? 'active' : ''} onClick={() => setUnit('liters')}>Liters</button>
          <button className={unit === 'gallons' ? 'active' : ''} onClick={() => setUnit('gallons')}>Gallons</button>
        </div>
      </header>

      <section className="workspace">
        <aside className="controls">
          <div className="intro">
            <p className="eyebrow">Race planner</p>
            <h1>Fuel to the finish.</h1>
            <p>Set your session values, safety reserve, and compare maximum against saving fuel usage.</p>
          </div>

          <div className="method-tabs" role="tablist">
            <button role="tab" aria-selected={method === 'time'} className={method === 'time' ? 'active' : ''} onClick={() => setMethod('time')}>Fuel by time</button>
            <button role="tab" aria-selected={method === 'laps'} className={method === 'laps' ? 'active' : ''} onClick={() => setMethod('laps')}>Fuel by laps</button>
          </div>

          <div className="field-grid">
            <label className="field-group span-2">
              <span>Lap time</span>
              <div className="split-input">
                <div><input inputMode="numeric" value={lapMinutes} onChange={(event) => setLapMinutes(event.target.value)} /><small>Min</small></div>
                <b>:</b>
                <div><input inputMode="numeric" value={lapSeconds} onChange={(event) => setLapSeconds(event.target.value)} /><small>Seconds</small></div>
              </div>
            </label>

            {method === 'time' ? (
              <label className="field-group">
                <span>Race time</span>
                <div className="input-unit"><input inputMode="numeric" value={raceMinutes} onChange={(event) => setRaceMinutes(event.target.value)} /><small>minutes</small></div>
              </label>
            ) : (
              <label className="field-group">
                <span>Race laps</span>
                <div className="input-unit"><input inputMode="numeric" value={raceLaps} onChange={(event) => setRaceLaps(event.target.value)} /><small>laps</small></div>
              </label>
            )}

            <label className="field-group">
              <span>Safety reserve</span>
              <div className="input-unit"><input inputMode="decimal" value={reserveLaps} onChange={(event) => setReserveLaps(event.target.value)} /><small>laps</small></div>
            </label>
          </div>

          <div className="scenario-editor">
            <div className="scenario-heading">
              <span>Fuel use / lap</span>
              <button type="button" onClick={addScenario} aria-label="Add fuel scenario"><Plus size={15} /> Add</button>
            </div>
            {scenarios.map((scenario) => (
              <div className="scenario-row" key={scenario.id}>
                <input className="scenario-name" aria-label="Scenario name" value={scenario.label} onChange={(event) => updateScenario(scenario.id, 'label', event.target.value)} />
                <div className="scenario-fuel">
                  <input inputMode="decimal" aria-label={`${scenario.label} fuel per lap`} value={scenarioDisplayValue(scenario.liters)} onChange={(event) => updateScenario(scenario.id, 'liters', event.target.value)} />
                  <small>{unit === 'liters' ? 'L' : 'gal'}</small>
                </div>
                {scenarios.length > 1 && (
                  <button type="button" className="remove-scenario" onClick={() => setScenarios((current) => current.filter((item) => item.id !== scenario.id))} aria-label={`Remove ${scenario.label}`}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button className="reset" onClick={reset}><RotateCcw size={15} /> Reset values</button>
        </aside>

        <section className="results" aria-live="polite">
          <div className="result-head">
            <div>
              <p className="eyebrow">Race load</p>
              <h2>{requiredDisplay.toFixed(requiredDisplay >= 100 ? 0 : 1)} <small>{unit === 'liters' ? 'L' : 'gal'}</small></h2>
            </div>
            <Fuel size={34} strokeWidth={1.6} />
          </div>

          <div className="fuel-track" aria-label={`${Math.round(lapsRequired)} laps of fuel`}>
            <div className="race-fill" style={{ width: `${Math.min(100, lapsByTime / Math.max(lapsRequired, 1) * 100)}%` }} />
            {parseValue(reserveLaps) > 0 && <div className="buffer-fill" style={{ left: `${Math.min(90, raceLapsRequired / Math.max(lapsRequired, 1) * 100)}%` }} />}
            <div className="track-label">Race <b>{raceLapsRequired.toFixed(1)} laps</b></div>
            {parseValue(reserveLaps) > 0 && <div className="buffer-label">Reserve <b>{parseValue(reserveLaps)} laps</b></div>}
          </div>

          <div className="metrics">
            <article>
              <span>Lap time</span>
              <strong>{pad(Math.floor(lapTimeSeconds / 60))}:{pad(lapTimeSeconds % 60)}</strong>
              <small>{lapTimeSeconds.toFixed(0)} seconds</small>
            </article>
            <article>
              <span>{method === 'time' ? 'Race laps' : 'Laps planned'}</span>
              <strong>{method === 'time' ? lapsByTime.toFixed(1) : parseValue(raceLaps).toFixed(0)}</strong>
              <small>{lapsRequired.toFixed(1)} including reserve</small>
            </article>
            <article>
              <span>Safety reserve</span>
              <strong>{parseValue(reserveLaps).toFixed(0)}</strong>
              <small>laps</small>
            </article>
          </div>

          {scenarioLoads.length > 1 && (
            <div className="scenario-results">
              {scenarioLoads.map((scenario) => {
                const displayLoad = unit === 'liters' ? scenario.requiredLiters : scenario.requiredLiters / LITERS_PER_GALLON
                const savings = scenario.requiredLiters < highestLoad
                  ? Math.max(highestLoad - scenario.requiredLiters, 0)
                  : 0
                const displaySavings = unit === 'liters' ? savings : savings / LITERS_PER_GALLON
                const savedWeight = savings * KG_PER_LITER
                const displaySavedWeight = unit === 'liters' ? savedWeight : savedWeight * LB_PER_KG
                return (
                  <article key={scenario.id}>
                    <span>{scenario.label}</span>
                    <strong>{displayLoad.toFixed(displayLoad >= 100 ? 0 : 1)} <small>{unit === 'liters' ? 'L' : 'gal'}</small></strong>
                    <em>
                      {savings > 0
                        ? `${displaySavings.toFixed(1)} ${unit === 'liters' ? 'L' : 'gal'} saved · ${displaySavedWeight.toFixed(1)} ${unit === 'liters' ? 'kg' : 'lb'} lighter`
                        : 'Maximum load'}
                    </em>
                  </article>
                )
              })}
            </div>
          )}

          <div className="session-rule">
            <div>
              <p className="eyebrow">Fuel strategy</p>
              <h3>{method === 'time' ? 'Time-based estimate' : 'Lap-based estimate'}</h3>
            </div>
            <ChevronDown size={18} />
          </div>
          <p className="formula">
            {method === 'time'
              ? `(${raceTimeSeconds.toLocaleString()}s ÷ ${lapTimeSeconds.toFixed(0)}s + ${parseValue(reserveLaps)} reserve) × usage`
              : `${raceLapsRequired.toFixed(0)} laps × usage`}
          </p>
        </section>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
