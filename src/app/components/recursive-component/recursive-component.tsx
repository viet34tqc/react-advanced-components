import { nodes } from './constants';
import FileSystemItem from './FileSystemItem';

const RecursiveComponent = () => {
  return (
    <ul>
      {nodes.map(node => (
        <FileSystemItem node={node} key={node.name} />
      ))}
    </ul>
  );
};

export default RecursiveComponent;
