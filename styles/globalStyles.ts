
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#6834b7', 
  secondary: '#FF6B6B', 
  background: '#FFFFFF', 
  text: '#1E1E1E', 
  accent: '#FFD166', 
};



export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: colors.text,
    fontWeight: 'bold',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});