export function Events({ events, clicks }: { events: string[], clicks: number }) {
  return (
    <ul>
      <li>ALL USERS CLICKS: {clicks}</li>
    {
      events.map((event, index) =>
        <li key={ index }>{ event }</li>
      )
    }
    </ul>
  );
}