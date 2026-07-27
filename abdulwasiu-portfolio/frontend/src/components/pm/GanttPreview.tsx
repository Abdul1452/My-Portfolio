/**
 * GanttPreview.tsx — Static Gantt Chart (Pure CSS Grid)
 *
 * THE BIG IDEA:
 *   A Gantt chart is just BARS positioned on a TIMELINE GRID. You don't need
 *   a charting library. We use CSS Grid where:
 *     - columns = time units (weeks)
 *     - each row  = one task
 *     - each bar  = a div spanning specific columns via grid-column: start/end
 *
 *   This demonstrates that many "complex" visuals are really just positioning.
 *
 * THE DATA MODEL:
 *   Each task has a startWeek and endWeek (1-indexed). A task from week 2 to
 *   week 4 gets `grid-column: 2 / 5` (grid lines are between columns, so the
 *   END is exclusive — week 4 means it ends at line 5).
 *
 * WHY THIS LIVES IN THE PORTFOLIO:
 *   It's a tangible PM artifact — proof you understand project scheduling,
 *   dependencies, and phases, not just theory.
 */

import styles from './GanttPreview.module.css'

// A single task bar on the chart.
interface GanttTask {
  id: string
  label: string
  startWeek: number   // 1-indexed
  endWeek: number     // inclusive
  phase: 'planning' | 'design' | 'build' | 'launch'  // controls the bar color
}

// Sample project plan — a realistic software delivery timeline.
const TOTAL_WEEKS = 8

const tasks: GanttTask[] = [
  { id: 't1', label: 'Discovery & Requirements', startWeek: 1, endWeek: 2, phase: 'planning' },
  { id: 't2', label: 'UX/UI Design (Figma)',      startWeek: 2, endWeek: 3, phase: 'design' },
  { id: 't3', label: 'Backend & API',             startWeek: 3, endWeek: 6, phase: 'build' },
  { id: 't4', label: 'Frontend Implementation',   startWeek: 4, endWeek: 7, phase: 'build' },
  { id: 't5', label: 'QA & Testing',              startWeek: 6, endWeek: 7, phase: 'build' },
  { id: 't6', label: 'Deployment & Launch',       startWeek: 7, endWeek: 8, phase: 'launch' },
]

export function GanttPreview() {
  return (
    <div className={styles.gantt}>
      {/* Header row: week numbers */}
      <div className={styles.header}>
        <div className={styles.taskLabelHead}>Task</div>
        <div
          className={styles.weeks}
          // Inline style sets the number of week columns dynamically.
          // gridTemplateColumns: repeat(8, 1fr) = 8 equal columns.
          style={{ gridTemplateColumns: `repeat(${TOTAL_WEEKS}, 1fr)` }}
        >
          {/* Create an array [1..8] and render a header cell per week */}
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
            <div key={i} className={styles.weekHead}>
              W{i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* One row per task */}
      {tasks.map(task => (
        <div key={task.id} className={styles.row}>
          {/* Left: task name */}
          <div className={styles.taskLabel}>{task.label}</div>

          {/* Right: the timeline grid where the bar sits */}
          <div
            className={styles.track}
            style={{ gridTemplateColumns: `repeat(${TOTAL_WEEKS}, 1fr)` }}
          >
            <div
              className={styles.bar}
              // The bar spans from its start week to end+1 (grid lines are
              // between columns, so an inclusive end needs +1).
              style={{
                gridColumn: `${task.startWeek} / ${task.endWeek + 1}`,
              }}
              // data-phase drives the color via CSS attribute selector.
              data-phase={task.phase}
            >
              <span className={styles.barLabel}>
                {task.endWeek - task.startWeek + 1}w
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendItem} data-phase="planning">Planning</span>
        <span className={styles.legendItem} data-phase="design">Design</span>
        <span className={styles.legendItem} data-phase="build">Build</span>
        <span className={styles.legendItem} data-phase="launch">Launch</span>
      </div>
    </div>
  )
}
