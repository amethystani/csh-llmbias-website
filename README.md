# 🎓 LLM Research Platform

A comprehensive platform for evaluating AI model performance on scientific genealogy and biography assessment tasks.

## 🌟 Features

### 📊 Scientific Academic Genealogy Assessment
- Search and select scientists from Excel data
- Generate lineage-based assessment questions
- Evaluate supervision relationships between researchers
- Track assessment results with ground truth comparison

### 🤖 Biography Assessment (AI Model Comparison)
- Compare multiple AI model outputs on scientist biographies
- Rate model accuracy on affiliation, research topics, and gender identification
- Support for minimal and comprehensive biography types
- Export rating data for analysis

### 🎨 Modern UI/UX
- Polished, millennial-friendly interface
- Glass morphism design elements
- Responsive layout for all screen sizes
- Accessibility-focused design

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Python 3.11** with Flask
- **pandas** for Excel data processing
- **Flask-CORS** for cross-origin requests
- **openpyxl** for Excel file handling

### Deployment
- **Frontend**: Vercel (recommended)
- **Backend**: Render (recommended)

## 🏗️ Project Structure

```
├── Frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── config/          # API configuration
│   │   └── types/           # TypeScript type definitions
│   ├── vercel.json          # Vercel deployment config
│   └── package.json
├── Backend/                  # Python Flask backend
│   ├── genealogy_service.py # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   ├── render.yaml         # Render deployment config
│   └── Prompts.xlsx        # Excel data source
├── DEPLOYMENT.md           # Deployment guide
├── DEPLOYMENT_CHECKLIST.md # Pre-deployment checklist
└── README.md              # This file
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git

### Backend Setup
```bash
cd Backend
pip install -r requirements.txt
python genealogy_service.py
```
Server runs on `http://localhost:5001`

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`

## 📊 Data Format

The platform expects an Excel file (`Prompts.xlsx`) with specific sheets:
- **"people to test (lineage)"** - Genealogy data with columns: Name, Type, Gender, 1 up, 1 down, all descendants, all ancestors
- **"people to test (bio)"** - Biography data with columns: Name, Type, Gender, Model, Biography(Minimal), Biography(Comprehensive)

## 🌐 API Endpoints

### Genealogy
- `GET /api/genealogy/people` - Get all scientists
- `GET /api/genealogy/questions/{name}` - Get assessment questions
- `POST /api/genealogy/assessments` - Save assessment results

### Biography
- `GET /api/biography/scientists` - Get all scientists with biography data
- `GET /api/biography/models` - Get available AI models
- `GET /api/biography/{name}` - Get biography data for scientist
- `POST /api/ratings` - Save model ratings

### Utility
- `GET /api/health` - Health check endpoint

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

Quick deployment:
1. **Backend (Render)**: Deploy from `Backend/` folder with `gunicorn --bind 0.0.0.0:$PORT genealogy_service:app`
2. **Frontend (Vercel)**: Deploy from `Frontend/` folder with Vite framework settings

## 🧪 Testing

### Backend Testing
```bash
curl http://localhost:5001/api/health
curl http://localhost:5001/api/genealogy/people
```

### Frontend Testing
1. Start both backend and frontend servers
2. Navigate to genealogy and biography assessment tabs
3. Test search, selection, and rating functionality

## 📈 Features in Detail

### Genealogy Assessment
- Dynamic question generation based on actual lineage data
- Support for supervisor-student relationship evaluation
- Ground truth tracking for accuracy assessment
- Export capabilities for research analysis

### Biography Assessment
- Multi-model comparison interface
- Categorical rating system (affiliation, research, gender)
- Biography type selection (minimal vs comprehensive)
- Real-time rating collection and storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for research purposes. Please ensure proper attribution when using or modifying.

## 🆘 Support

- Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for common issues
- Review logs in browser console and server output
- Verify environment variables are set correctly

## 🎯 Future Enhancements

- [ ] User authentication and authorization
- [ ] Advanced analytics dashboard
- [ ] Batch processing capabilities
- [ ] Integration with additional AI models
- [ ] Advanced filtering and search options

---

Built with ❤️ for advancing research in AI evaluation and scientific genealogy.
