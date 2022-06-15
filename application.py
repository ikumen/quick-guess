from backend import factory

app = factory.create_app()

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('application:app', host='0.0.0.0', port=5000, reload=True, log_level='info')
