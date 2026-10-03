# CodeAlpha Data Analytics Internship

Data analytics internship project completed as part of the CodeAlpha Data Analytics Internship.

The project analyzes the **Amazon Fine Food Reviews** dataset using Python, Pandas, statistical analysis, data visualization, and natural language processing.

## Project Overview

This project focuses on three CodeAlpha Data Analytics tasks:

- **Task 2 — Exploratory Data Analysis (EDA)**
- **Task 3 — Data Visualization**
- **Task 4 — Sentiment Analysis**

The goal is to transform a large collection of customer reviews into meaningful analytical findings about customer ratings, review activity, product concentration, review characteristics, helpfulness, and sentiment.

---

## Dataset

The project uses the **Amazon Fine Food Reviews** dataset.

The dataset contains customer reviews of food products purchased through Amazon, including:

- Product ID
- User ID
- Profile name
- Review helpfulness
- Star rating
- Review timestamp
- Review summary
- Review text

The dataset contains **568,454 reviews**.

The original dataset is distributed in a text-based format where each review consists of multiple `field: value` lines. A custom parser was created in `src/parse_reviews.py` to convert the source format into a Pandas DataFrame.

### Dataset Location

Place the dataset at:

```text
data/raw/Reviews.csv