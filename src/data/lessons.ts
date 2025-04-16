export interface Question {
  type: 'multiple-choice' | 'code' | 'explanation';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export const topics: Topic[] = [
  {
    id: 'intro-analysis',
    title: 'Intro to Analysis of Algorithms',
    description: 'Learn about time and space complexity, Big O notation, and algorithm analysis techniques.',
    lessons: [
      {
        id: 'big-o-notation',
        title: 'Big O Notation',
        description: 'Understanding time and space complexity using Big O notation.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What does O(1) represent in Big O notation?',
            options: ['Constant time', 'Linear time', 'Quadratic time', 'Logarithmic time'],
            correctAnswer: 'Constant time',
            explanation: 'O(1) represents constant time complexity, meaning the operation takes the same amount of time regardless of input size.'
          },
          {
            type: 'multiple-choice',
            question: 'Which of these operations has O(n) time complexity?',
            options: ['Accessing an array element by index', 'Finding an element in an unsorted array', 'Binary search', 'Inserting at the end of a linked list'],
            correctAnswer: 'Finding an element in an unsorted array',
            explanation: 'Finding an element in an unsorted array requires checking each element once, resulting in linear time complexity.'
          }
        ]
      },
      {
        id: 'complexity-analysis',
        title: 'Complexity Analysis',
        description: 'Analyzing and comparing different algorithms based on their complexity.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is the time complexity of a nested loop where both loops iterate n times?',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
            correctAnswer: 'O(n²)',
            explanation: 'Nested loops multiply their complexities, so n * n = n².'
          }
        ]
      }
    ]
  },
  {
    id: 'sorting-1',
    title: 'Sorting (1)',
    description: 'Introduction to basic sorting algorithms and their implementations.',
    lessons: [
      {
        id: 'bubble-sort',
        title: 'Bubble Sort',
        description: 'Understanding and implementing the bubble sort algorithm.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is the worst-case time complexity of bubble sort?',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
            correctAnswer: 'O(n²)',
            explanation: 'Bubble sort requires n passes through the array, and each pass requires n comparisons in the worst case.'
          }
        ]
      },
      {
        id: 'insertion-sort',
        title: 'Insertion Sort',
        description: 'Learning about insertion sort and its implementation.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is the best-case time complexity of insertion sort?',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
            correctAnswer: 'O(n)',
            explanation: 'When the array is already sorted, insertion sort only needs to make one pass through the array.'
          }
        ]
      }
    ]
  },
  {
    id: 'lists',
    title: 'Lists',
    description: 'Understanding and implementing different types of lists.',
    lessons: [
      {
        id: 'array-list',
        title: 'Array Lists',
        description: 'Learning about array-based list implementations.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is the time complexity of accessing an element in an array list?',
            options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
            correctAnswer: 'O(1)',
            explanation: 'Array lists provide constant time access to elements using their index.'
          }
        ]
      },
      {
        id: 'linked-list',
        title: 'Linked Lists',
        description: 'Understanding singly and doubly linked lists.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is the time complexity of inserting at the beginning of a linked list?',
            options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
            correctAnswer: 'O(1)',
            explanation: 'Inserting at the beginning of a linked list only requires updating the head pointer.'
          }
        ]
      }
    ]
  },
  {
    id: 'stacks-queues',
    title: 'Stacks and Queues',
    description: 'Learning about stack and queue data structures and their applications.',
    lessons: [
      {
        id: 'stacks',
        title: 'Stacks',
        description: 'Understanding stack operations and implementations.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'Which principle do stacks follow?',
            options: ['FIFO', 'LIFO', 'Priority-based', 'Random access'],
            correctAnswer: 'LIFO',
            explanation: 'Stacks follow the Last In, First Out (LIFO) principle.'
          }
        ]
      },
      {
        id: 'queues',
        title: 'Queues',
        description: 'Learning about queue operations and implementations.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'Which principle do queues follow?',
            options: ['FIFO', 'LIFO', 'Priority-based', 'Random access'],
            correctAnswer: 'FIFO',
            explanation: 'Queues follow the First In, First Out (FIFO) principle.'
          }
        ]
      }
    ]
  },
  {
    id: 'recursion-sorting-2',
    title: 'Recursion, Sorting (2), and Searching',
    description: 'Advanced sorting algorithms and recursive problem-solving techniques.',
    lessons: [
      {
        id: 'merge-sort',
        title: 'Merge Sort',
        description: 'Understanding and implementing the merge sort algorithm.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is the time complexity of merge sort?',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
            correctAnswer: 'O(n log n)',
            explanation: 'Merge sort divides the array in half recursively (log n) and merges the halves (n).'
          }
        ]
      },
      {
        id: 'quick-sort',
        title: 'Quick Sort',
        description: 'Learning about quick sort and its implementation.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is the worst-case time complexity of quick sort?',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
            correctAnswer: 'O(n²)',
            explanation: 'When the pivot is always the smallest or largest element, quick sort degrades to O(n²).'
          }
        ]
      }
    ]
  },
  {
    id: 'binary-trees',
    title: 'Binary Trees and Tree Traversals',
    description: 'Understanding binary trees and different traversal methods.',
    lessons: [
      {
        id: 'tree-traversals',
        title: 'Tree Traversals',
        description: 'Learning about different ways to traverse binary trees.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'Which traversal visits nodes in ascending order in a BST?',
            options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
            correctAnswer: 'In-order',
            explanation: 'In-order traversal of a BST visits nodes in ascending order.'
          }
        ]
      }
    ]
  },
  {
    id: 'bst',
    title: 'Binary Search Trees',
    description: 'Learning about BST properties and operations.',
    lessons: [
      {
        id: 'bst-operations',
        title: 'BST Operations',
        description: 'Understanding insertion, deletion, and search in BSTs.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is the average time complexity of search in a BST?',
            options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
            correctAnswer: 'O(log n)',
            explanation: 'In a balanced BST, search operations take logarithmic time.'
          }
        ]
      }
    ]
  },
  {
    id: 'avl-bplus',
    title: 'AVL Trees, B+ Trees',
    description: 'Understanding self-balancing trees and their applications.',
    lessons: [
      {
        id: 'avl-trees',
        title: 'AVL Trees',
        description: 'Learning about AVL tree rotations and balancing.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is the maximum height difference allowed between subtrees in an AVL tree?',
            options: ['0', '1', '2', '3'],
            correctAnswer: '1',
            explanation: 'AVL trees maintain a height difference of at most 1 between any two subtrees.'
          }
        ]
      }
    ]
  },
  {
    id: 'heaps',
    title: 'Heaps',
    description: 'Understanding heap data structure and its applications.',
    lessons: [
      {
        id: 'heap-operations',
        title: 'Heap Operations',
        description: 'Learning about heap operations and heap sort.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'What is the time complexity of extracting the minimum from a min-heap?',
            options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
            correctAnswer: 'O(log n)',
            explanation: 'Extracting the minimum requires heapifying the remaining elements, which takes logarithmic time.'
          }
        ]
      }
    ]
  },
  {
    id: 'graphs',
    title: 'Graphs',
    description: 'Understanding graph representations and algorithms.',
    lessons: [
      {
        id: 'graph-traversals',
        title: 'Graph Traversals',
        description: 'Learning about BFS and DFS algorithms.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'Which traversal uses a queue?',
            options: ['DFS', 'BFS', 'Both', 'Neither'],
            correctAnswer: 'BFS',
            explanation: 'BFS uses a queue to explore nodes level by level.'
          }
        ]
      }
    ]
  },
  {
    id: 'hash-tables',
    title: 'Hash Tables',
    description: 'Understanding hash functions and collision resolution.',
    lessons: [
      {
        id: 'hashing',
        title: 'Hashing',
        description: 'Learning about hash functions and collision handling.',
        questions: [
          {
            type: 'multiple-choice',
            question: 'Which collision resolution technique uses linked lists?',
            options: ['Linear probing', 'Quadratic probing', 'Double hashing', 'Separate chaining'],
            correctAnswer: 'Separate chaining',
            explanation: 'Separate chaining uses linked lists to handle collisions.'
          }
        ]
      }
    ]
  }
]; 