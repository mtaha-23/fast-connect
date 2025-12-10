This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

1. **Node.js** - Make sure you have Node.js installed
2. **Python** - Make sure you have Python 3.7+ installed
3. **Python Dependencies** - Install required Python packages:

```bash
cd python-backend
pip install -r requirements.txt
```

Or if you're using Python 3 specifically:
```bash
cd python-backend
python3 -m pip install -r requirements.txt
```

### Running the Development Server

First, install Node.js dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Troubleshooting

If you encounter errors when using the Batch Advisor feature:

1. **"pandas not installed"** - Run `pip install pandas` or `pip install -r python-backend/requirements.txt`
2. **"data.csv not found"** - Make sure `python-backend/data.csv` exists in the project
3. **"Failed to start Python process"** - Make sure Python is in your PATH. You can set `PYTHON_PATH` environment variable:
   - Windows: `set PYTHON_PATH=python` or `set PYTHON_PATH=python3`
   - Linux/Mac: `export PYTHON_PATH=python3`

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
