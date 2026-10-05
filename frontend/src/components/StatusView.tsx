type StatusViewProps = {
  title: string;
  description?: string;
};

export function StatusView({ title, description }: StatusViewProps) {
  return (
    <div className="status-view" role="status">
      <p>{title}</p>
      {description && <span>{description}</span>}
    </div>
  );
}
