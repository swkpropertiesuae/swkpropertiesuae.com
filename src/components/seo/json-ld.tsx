/** Renders one or more JSON-LD blocks. Server-safe. */
export function JsonLd({ id, data }: { id?: string; data: object | object[] }) {
  const list = Array.isArray(data) ? data : [data]
  return (
    <>
      {list.map((d, i) => (
        <script
          key={id ? `${id}-${i}` : i}
          id={id && i === 0 ? id : undefined}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  )
}
