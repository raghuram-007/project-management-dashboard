import { getInitials } from '../../utils/helpers';

export default function Avatar({ name, image, size = 'md', style = {} }) {
  const sizeClass = `avatar avatar-${size}`;
  return (
    <div className={sizeClass} style={style} title={name}>
      {image
        ? <img src={image} alt={name} />
        : getInitials(name)
      }
    </div>
  );
}
