import type { CodeTableData } from '../types'

// Tabla de actividades con un número cada una: los días van en las columnas y los momentos del día en las filas. Cada casilla
// lleva su dibujo, con el nombre de la actividad como nombre accesible; la leyenda dice el número de cada dibujo.
export function CodeTable({ data }: { data: CodeTableData }) {
  const nombre = (emoji: string) => data.legend.find((l) => l.emoji === emoji)?.name
  return (
    <div className="code-box">
      <table className="code-table" aria-label="Actividades de cada día">
        <thead>
          <tr>
            <td className="esquina" aria-hidden="true" />
            {data.columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((fila, f) => (
            <tr key={fila}>
              <th scope="row">{fila}</th>
              {data.cells[f].map((emoji, c) => (
                <td key={c}>
                  <span role="img" aria-label={nombre(emoji)}>
                    {emoji}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="code-legend" aria-label="Número de cada actividad">
        {[...data.legend].sort((a, b) => a.number - b.number).map((l) => (
          <li key={l.emoji}>
            <span role="img" aria-label={l.name}>
              {l.emoji}
            </span>{' '}
            = {l.number}
          </li>
        ))}
      </ul>
    </div>
  )
}
