interface ActionBarButtonProps {
  icon: string;
  color: string;
  action: () => void;
}

export const ActionBarButton: React.FC<ActionBarButtonProps> = (props) => {
  const { icon, color, action } = props;

  return (
    <button className={`button is-${color} is-small `} onClick={() => action()}>
      <i className={`fa-solid fa-${icon}`}></i>
    </button>
  );
};
