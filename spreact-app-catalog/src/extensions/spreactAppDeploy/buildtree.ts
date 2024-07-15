export class TreeNode {
    name: string;
    children: TreeNode[];

    constructor(name: string) {
        this.name = name;
        this.children = [];
    }

    addChild(child: TreeNode) {
        this.children.push(child);
    }
}

// Function to build the tree from the list of paths
export default function buildTree(rootFolder:string, paths: string[][]): TreeNode {
    const root = new TreeNode(rootFolder);

    paths.forEach(path => {
        let currentNode = root;

        path.forEach(directory => {
            // Check if the current directory already exists as a child
            let existingNode = currentNode.children.filter(node => node.name === directory);

            if (existingNode.length == 1) {
                // If it exists, move to the existing node
                currentNode = existingNode[0];
            } else {
                // If it doesn't exist, create a new node and add it as a child
                const newNode = new TreeNode(directory);
                currentNode.addChild(newNode);
                currentNode = newNode;
            }
        });
    });

    return root;
}
